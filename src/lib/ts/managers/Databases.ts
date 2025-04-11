import { T_Database, T_Persistence, T_Preference } from '../common/Enumerations';
import { w_database, w_t_database } from '../common/Stores';
import { c } from '../managers/Configuration';
import { p } from '../managers/Preferences';
import { k } from '../common/Constants';
import DBCommon from '../dbs/DBCommon';
import { get } from 'svelte/store';
// Lazy load database instances
let dbAirtable: DBCommon;
let dbFirebase: DBCommon;
let dbLocal: DBCommon;
let dbTest: DBCommon;

// each db has its own hierarchy
// when switching to another db
// w_hierarchy is set to its hierarchy

export default class Databases {

	get db_now() { return get(w_database); }

	queryStrings_apply() {
		const queryStrings = c.queryStrings;
		const type = queryStrings.get('db');
		if (!!type) {
			this.db_set_accordingToType(type);
			w_t_database.set(type);
		}
		this.db_now.queryStrings_apply();
	}

	constructor() {
		let done = false;
		setTimeout(async () => {
			await this.db_set_accordingToType(p.read_key(T_Preference.db) ?? 'firebase');
			w_t_database.subscribe(async (type: string) => {
				if (!!type && (!done || (type && this.db_now.t_database != type))) {
					done = true;
					setTimeout(async () => {
						await this.db_set_accordingToType(type);
						p.write_key(T_Preference.db, type);
						await this.db_now.hierarchy_setup_fetch_andBuild();
					}, 0);
				}
			});
		}, 0);
	}

	db_change_toNext(forward: boolean) { w_t_database.set(this.db_next_get(forward)); }
	async db_set_accordingToType(type: string) { w_database.set(await this.db_forType(type)); }
	isRemote(kind_persistence: T_Persistence): boolean { return kind_persistence == T_Persistence.remote; }
	isPersistent(kind_persistence: T_Persistence): boolean { return kind_persistence != T_Persistence.none; }

	restore_db() {
		let type = p.read_key(T_Preference.db) ?? 'firebase';
		if (type == 'file') { type = 'local'; }
		w_t_database.set(type);
	}

	db_next_get(forward: boolean): T_Database {
		switch (this.db_now.t_database) {
			case T_Database.local:	  return forward ? T_Database.firebase : T_Database.test;
			case T_Database.firebase: return forward ? T_Database.airtable : T_Database.local;
			case T_Database.airtable: return forward ? T_Database.test	   : T_Database.firebase;
			default:				  return forward ? T_Database.local	   : T_Database.airtable;
		}
	}

	async db_forType(t_database: string): Promise<DBCommon> {
		switch (t_database) {
			case T_Database.firebase: 
				if (!dbFirebase) {
					const { dbFirebase: fb } = await import('../dbs/DBFirebase');
					dbFirebase = fb;
				}
				return dbFirebase;
			case T_Database.airtable: 
				if (!dbAirtable) {
					const { dbAirtable: at } = await import('../dbs/DBAirtable');
					dbAirtable = at;
				}
				return dbAirtable;
			case T_Database.local:	  
				if (!dbLocal) {
					const { dbLocal: local } = await import('../dbs/DBLocal');
					dbLocal = local;
				}
				return dbLocal;
			default:				  
				if (!dbTest) {
					const { dbTest: test } = await import('../dbs/DBTest');
					dbTest = test;
				}
				return dbTest;
		}
	}

	get startupExplanation(): string {
		const type = this.db_now.t_database;
		let from = k.empty;
		switch (type) {
			case T_Database.firebase: from = `, from ${this.db_now.idBase}`; break;
			case T_Database.test:	  return k.empty;
		}
		return `(loading your ${type} data${from})`;
	}

}

export const databases = new Databases();
