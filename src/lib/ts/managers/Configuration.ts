import { stores, w_t_database, w_device_isMobile, w_database } from '../common/Stores';
import { debug, layout } from '../common/Global_Imports';
import { show } from '../managers/Visibility';
import { p } from '../managers/Preferences';
import { k } from '../common/Constants';
import { u } from '../common/Utilities';
import { databases } from './Databases';
import { w } from '../layout/G_Window';
import { e } from '../signals/Events';
import { get } from 'svelte/store';

export class Configuration {

	eraseDB = 0;
	erasePreferences = 0;
	allow_GraphEditing = true;
	allow_TitleEditing = true;
	allow_HorizontalScrolling = true;
	queryStrings = new URLSearchParams(window.location.search);

	configure() {
		
		//////////////////////////////////////////////////
		//												//
		//												//
		//	 this is the first code called by the app	//
		//												//
		//												//
		//////////////////////////////////////////////////

		stores.setup_defaults();
		w_device_isMobile.set(this.device_isMobile);
		debug.queryStrings_apply();						// debugging
		show.restore_state();							// local persistance
		layout.layout_tops_forPanelBanners();
		w.restore_state();
		this.queryStrings_apply();						// so db can be erased
		databases.restore_db();
		p.restore_defaults();							// some prefs need the db restored
		show.queryStrings_apply();
		e.setup();
	}

	queryStrings_apply() {
		const queryStrings = this.queryStrings;
        const eraseOptions = queryStrings.get('erase')?.split(k.comma) ?? [];
        const disableOptions = queryStrings.get('disable')?.split(k.comma) ?? [];
		for (const disableOption of disableOptions) {
			switch (disableOption) {
				case 'editGraph':			this.allow_GraphEditing		   = false; break;
				case 'editTitles':			this.allow_TitleEditing		   = false; break;
				case 'horizontalScrolling': this.allow_HorizontalScrolling = false; break;
			}
		}
		for (const eraseOption of eraseOptions) {
			switch (eraseOption) {
				case 'data':	 this.eraseDB = 2;			break;
				case 'settings': this.erasePreferences = 2; break;
			}
		}
    }

	get isServerLocal(): boolean {
		const hostname = window.location.hostname;
		return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
	}

	get siteTitle(): string {
		const t_database = get(w_t_database);
		let base_name = k.empty;
		if (!!get(w_database)) {
			base_name = get(w_database).idBase + ', ';
		}
		const host = this.isServerLocal ? 'local' : 'remote';
		const db_name = t_database ? (t_database! + ', ') : k.empty;
		return `Seriously (${host}, ${db_name}${base_name}${u.browserType}, α)`;
	}

	get device_isMobile(): boolean {
		const userAgent = navigator.userAgent;
		if (/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {    // Check for phones
			return true;
		}
		if (/iPad|Android|Touch/i.test(userAgent) && !(window as any).MSStream) {    // Check for tablets
			return true;
		}
		return false;
	}

	open_tabFor(url: string) { window.open(url, 'help-webseriously')?.focus(); }
	showHelp() { this.open_tabFor(this.isServerLocal ? k.local_help_url : k.remote_help_url); }

}

export let c = new Configuration();
