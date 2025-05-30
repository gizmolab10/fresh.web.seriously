import { Predicate, Persistable, Relationship, Seriously_Range } from '../common/Global_Imports';
import { w_hierarchy, w_color_trigger, w_count_rebuild, w_database } from '../common/Stores';
import { T_Thing, T_Trait, T_Debug, T_Predicate } from '../common/Global_Imports';
import { k, u, debug, colors, Trait, Ancestry } from '../common/Global_Imports';
import { w_ancestry_focus, w_ancestries_expanded } from '../common/Stores';
import { T_Persistable } from '../common/Enumerations';
import type { Dictionary } from '../common/Types';
import { get } from 'svelte/store';

export default class Thing extends Persistable {
	selectionRange = new Seriously_Range(0, 0);
	bulkRootID: string = k.empty;
	title: string;
	color: string;
	type: T_Thing;

	constructor(idBase: string, id: string, title = k.title_default, color = colors.default_forThings, type = T_Thing.generic, already_persisted: boolean = false) {
		super(get(w_database).t_database, idBase, T_Persistable.things, id, already_persisted);
		this.selectionRange = new Seriously_Range(0, title.length);
		this.title = title;
		this.color = color;
		this.type = type;
	};
	
	get parents():				Array		 <Thing> { return this.parents_forKind(T_Predicate.contains); }
	get traits():				Array		 <Trait> { return get(w_hierarchy).traits_forOwnerHID(this.hid) ?? []; }
	get parentIDs():			Array		<string> { return this.parents.map(t => t.id); }
	get ancestries():		 	Array	  <Ancestry> { return this.ancestries_for(Predicate.contains); }
	get relatedRelationships(): Array <Relationship> { return this.relationships_ofKind_forParents(T_Predicate.isRelated, false); }
	get fields():		  		Dictionary  <string> { return { title: this.title, color: this.color, type: this.type }; }
	get quest():					   string | null { return get(w_hierarchy).trait_forType_ownerHID(T_Trait.quest, this.hid)?.text ?? null; }
	get consequence():				   string | null { return get(w_hierarchy).trait_forType_ownerHID(T_Trait.consequence, this.hid)?.text ?? null; }
	get idBridging():						  string { return this.isBulkAlias ? this.bulkRootID : this.id; }
	get description():						  string { return this.id + ' "' + this.title + '"'; }
	get breadcrumb_title():					  string { return this.title.clipWithEllipsisAt(15); }
	get titleWidth():						  number { return u.getWidthOf(this.title); }
	get isRoot():							 boolean { return this.type == T_Thing.root; }
	get isBulkAlias():						 boolean { return this.type == T_Thing.bulk; }
	get isExternals():						 boolean { return this.type == T_Thing.externals; }
	get isAcrossBulk():						 boolean { return this.idBase != get(w_hierarchy).db.idBase; }
	get hasMultipleParents():				 boolean { return this.ancestries.length > 1; }
	get hasParents():						 boolean { return this.hasParents_forKind(T_Predicate.contains); }
	get isFocus():							 boolean { return (get(w_ancestry_focus).thing?.id ?? k.empty) == this.id; }
	get hasRelated():						 boolean { return this.relatedRelationships.length > 0; }

	get parents_ofAllKinds(): Array<Thing> {
		let parents: Array<Thing> = [];
		for (const predicate of get(w_hierarchy).predicates) {
			const more = this.parents_forKind(predicate.kind)
			parents = u.uniquely_concatenateArrays(parents, more);
		}
		return parents;
	}

	get thing_isBulk_expanded(): boolean {		// cross db ancestries needs special attention
		if (this.isBulkAlias) {
			const ancestries = get(w_ancestries_expanded);
			if (!!ancestries) {
				for (const ancestry of ancestries) {
					if (this.id == ancestry.thing?.id) {
						return true;
					}
				}
			}
		}
		return false;
	}

	debugLog(message: string) { this.log(T_Debug.things, message); }
	log(option: T_Debug, message: string) { debug.log_maybe(option, message + k.space + this.description); }
	hasParents_forKind(kind: string): boolean { return this.parents_forKind(kind).length > 0; }
	setTraitText_forType(text: string, type: T_Trait) { get(w_hierarchy).trait_setText_forType_ownerHID(text, type, this.id); }

	override isInDifferentBulkThan(other: Thing): boolean {
		return super.isInDifferentBulkThan(other) || (other.isBulkAlias && !this.isBulkAlias && this.idBase != other.title);
	}

	signal_color_change() {
		w_count_rebuild.update(n => n + 1);
		w_color_trigger.set(`${this.id}${k.generic_separator}${get(w_count_rebuild)}`);
	}

	relationships_inBothDirections_forKind(kind: string): Array<Relationship> {
		const childrenRelationships = this.relationships_ofKind_forParents(kind, false);
		const parentsRelationships = this.relationships_ofKind_forParents(kind, true);
		return u.uniquely_concatenateArrays(parentsRelationships, childrenRelationships);
	}

	async persistent_create_orUpdate(already_persisted: boolean) {
		if (already_persisted) {
			await get(w_database).thing_persistentUpdate(this);
		} else {
			await get(w_database).thing_remember_persistentCreate(this);
		}
	}

	relationships_ofKind_forParents(kind: string, forParents: boolean): Array<Relationship> {
		const id = forParents ? this.id : this.idBridging;		//  use idBridging for children, in case thing is a bulk alias
		if ((!!id || id == k.empty) && id != k.unknown) {
			return get(w_hierarchy).relationships_forKindPredicate_hid_thing_isChild(kind, id.hash(), forParents);
		}
		return [];
	}

	crumbWidth(numberOfParents: number): number {
		const forNone = this.titleWidth + 10;
		switch (numberOfParents) {
			case 0:	 return forNone;
			case 1:	 return forNone + 11;
			default: return forNone + 18;
		}
	}

	parentRelationships_for(predicate: Predicate): Array<Relationship> {
		let relationships: Array<Relationship> = [] 
		if (predicate.isBidirectional) {
			relationships = this.relationships_inBothDirections_forKind(predicate.kind);
		} else {
			relationships = this.relationships_ofKind_forParents(predicate.kind, true);
		}
		return relationships;
	}


	remove_fromGrabbed_andExpanded_andResolveFocus() {
		// called when this (thing) is being deleted
		for (const ancestry of this.ancestries) {		// DO NOT REMOVE ANCESTRIES ???
			if (ancestry.id_thing == this.id) {
				ancestry.remove_fromGrabbed_andExpanded();
			}
		}
		const focus = get(w_ancestry_focus);
		if (focus.thing?.hid == this.hid) {
			get(w_hierarchy).rootAncestry.becomeFocus();
		}
	}

	parents_forKind(kind: string): Array<Thing> {
		let parents: Array<Thing> = [];
		if (!this.isRoot) {
			const relationships = this.relationships_ofKind_forParents(kind, true);
			for (const relationship of relationships) {
				const thing = relationship.parent;
				if (!!thing) {
					parents.push(thing);
				}
			}
		}
		return parents;
	}

	static readonly ANCESTRIES: unique symbol;

	uniqueAncestries_for(predicate: Predicate | null): Array<Ancestry> {
		let ancestries: Array<Ancestry> = [];
		if (!!predicate){
			if (predicate.isBidirectional) {
				ancestries = this.ancestries_for(predicate);
			} else {
				let parents = this.parents_forKind(predicate.kind) ?? [];
				for (const parent of parents) {
					const parentAncestries = parent.isRoot ? [get(w_hierarchy).rootAncestry] : parent.ancestries_for(predicate);
					ancestries = u.concatenateArrays(ancestries, parentAncestries);
				}
			}
			ancestries = u.strip_thingDuplicates_from(u.strip_falsies(ancestries));
		}
		return ancestries;
	}

	ancestries_for(predicate: Predicate | null, visited: Array<string> = []): Array<Ancestry> {
		// the ancestry of each parent [of this thing]
		let ancestries: Array<Ancestry> = [];
		if (!!predicate) {
			function addAncestry(ancestry: Ancestry | null) {
				if (!!ancestry) {
					ancestries.push(ancestry);
				}
			}
			const parentRelationships = this.parentRelationships_for(predicate);
			for (const parentRelationship of parentRelationships) {
				if (predicate.isBidirectional) {
					const child = parentRelationship.child;
					if (!!child && child.id != this.id) {
						addAncestry(get(w_hierarchy).ancestry_remember_createUnique(parentRelationship.id, predicate.kind));
					}
				} else {
					const parent = parentRelationship.parent;
					if (!!parent && !visited.includes(parent.id)) {
						const id_parentRelationship = parentRelationship.id;		// TODO, this is the wrong relationship; needs the next one
						const parentAncestries = parent.ancestries_for(predicate, [...visited, parent.id]) ?? [];
						if (parentAncestries.length == 0) {
							addAncestry(get(w_hierarchy).rootAncestry.uniquelyAppend_relationshipID(id_parentRelationship));
						} else {
							parentAncestries.map((p: Ancestry) => addAncestry(p.uniquelyAppend_relationshipID(id_parentRelationship)));
						}
					}
				}
			}
			ancestries = u.strip_hidDuplicates(ancestries);
		}
		ancestries = u.sort_byOrder(ancestries).reverse();
		return ancestries;
	}
	
}
