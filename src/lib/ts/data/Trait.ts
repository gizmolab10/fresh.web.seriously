import { k, Persistable, Thing, T_Trait } from '../common/Global_Imports';
import { w_database, w_hierarchy } from '../common/Stores';
import { T_Persistable } from '../common/Enumerations';
import { get } from 'svelte/store';
import Airtable from 'airtable';

export default class Trait extends Persistable {
	type: T_Trait = T_Trait.generic;
	ownerID: string = k.empty;
	text: string = k.empty;

	constructor(idBase: string, id: string, ownerID: string, type: T_Trait, text: string = k.empty, already_persisted: boolean = false) {
		super(get(w_database).t_database, idBase, T_Persistable.traits, id, already_persisted);
		this.ownerID = ownerID;
		this.type = type;
		this.text = text;
	}

	get owner():	   Thing | null { return get(w_hierarchy).thing_forHID(this.ownerID.hash()); }
	get fields(): Airtable.FieldSet { return { type: this.type, ownerID: [this.ownerID], text: this.text }; }

	async persistent_create_orUpdate(already_persisted: boolean) {
		if (already_persisted) {
			await get(w_database).trait_persistentUpdate(this);
		} else {
			await get(w_database).trait_remember_persistentCreate(this);
		}
	}

}
