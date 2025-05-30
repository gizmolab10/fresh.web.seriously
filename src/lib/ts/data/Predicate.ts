import { w_database, w_hierarchy, w_ring_rotation_angle } from '../common/Stores';
import { k, debug, T_Debug, T_Predicate } from '../common/Global_Imports';
import { T_Persistable } from '../common/Enumerations';
import Persistable from './Persistable';
import { get } from 'svelte/store';

export default class Predicate extends Persistable {
	isBidirectional: boolean;
	kind: T_Predicate;

	constructor(id: string, kind: T_Predicate, isBidirectional: boolean, already_persisted: boolean = false) {
		super(get(w_database).t_database, k.empty, T_Persistable.predicates, id, already_persisted);
		this.isBidirectional = isBidirectional;
		this.kind			 = kind;
	}
	
	log(option: T_Debug, message: string)					 { debug.log_maybe(option, message + k.space + this.description); }
	get description():					  			  string { return this.kind.unCamelCase().lastWord(); }
	static isBidirectional(kind: T_Predicate):		 boolean { return kind == T_Predicate.isRelated; }
	static get contains():				    Predicate | null { return this.predicate_forKind(T_Predicate.contains); }
	static get explains():				    Predicate | null { return this.predicate_forKind(T_Predicate.explains); }
	static get requires():				    Predicate | null { return this.predicate_forKind(T_Predicate.requires); }
	static get supports():				    Predicate | null { return this.predicate_forKind(T_Predicate.supports); }
	static get isRelated():				    Predicate | null { return this.predicate_forKind(T_Predicate.isRelated); }
	static get appreciates():			  	Predicate | null { return this.predicate_forKind(T_Predicate.appreciates); }
	static predicate_forKind(kind: string): Predicate | null { return get(w_hierarchy).predicate_forKind(kind) ?? null; }

	async persistent_create_orUpdate(already_persisted: boolean) {
		if (already_persisted) {
			await get(w_database).predicate_persistentUpdate(this);
		} else {
			await get(w_database).predicate_remember_persistentCreate(this);
		}
	}
	
	angle_ofFork_when(points_toChildren: boolean) {
		// returns one of three angles: 1) children_angle 2) opposite+tweak 3) opposite-tweak
		const tweak = 2 * Math.PI / 3;					// equilateral distribution
		const children_angle = get(w_ring_rotation_angle);
		const raw = this.isBidirectional ?
			children_angle + tweak :
			points_toChildren ? children_angle :		// one directional, use global
			children_angle - tweak;
		return raw.angle_normalized() ?? 0;
	}

}