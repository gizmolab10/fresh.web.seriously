import { w_t_countDots, w_show_details, w_show_related } from '../common/Stores';
import { T_Report, T_Hierarchy, T_Preference } from '../common/Enumerations';
import type { Dictionary } from '../common/Types';
import { c } from '../managers/Configuration';
import { p } from '../managers/Preferences';
import { layout } from '../layout/Layout';
import { k } from '../common/Constants';
import { w } from '../layout/G_Window';
import { get } from 'svelte/store';

export class Visibility {
	debug_cursor = false;
	traits		 = false;
	t_info		 = T_Report.focus;

	queryStrings_apply() {
		const queryStrings = c.queryStrings;
		const hiddenNames = queryStrings.get('hide')?.split(k.comma) ?? [];
		const visibleNames = queryStrings.get('show')?.split(k.comma) ?? [];
		const hidden = Object.fromEntries(hiddenNames.map(s => [s, false]) ?? {});
		const visible = Object.fromEntries(visibleNames.map(s => [s, true]) ?? {});
		const keyedFlags: Dictionary<boolean> = {...visible, ...hidden};
        for (const [name, flag] of Object.entries(keyedFlags)) {
			switch (name) {
				case 'details':
					w_show_details.set(flag);
					break;
				case 'related':
					w_show_related.set(flag);
					break;
				case 'traits':
					this.traits = flag;
					p.write_key(T_Preference.traits, flag);
					break;
				case 'parents':
					const mode = flag ? T_Hierarchy.parents : T_Hierarchy.children;
					layout.set_t_tree(mode);
					break;
			}
		}
	}

	showing_countDots_ofType(t_counts: T_Hierarchy): boolean { return get(w_t_countDots).includes(T_Hierarchy[t_counts]) }
	get children_dots(): boolean { return  this.showing_countDots_ofType(T_Hierarchy.children); }
	get related_dots(): boolean { return  this.showing_countDots_ofType(T_Hierarchy.related); }
	get parent_dots(): boolean { return  this.showing_countDots_ofType(T_Hierarchy.parents); }
	
	restore_state() {
		this.traits = p.read_key(T_Preference.traits) ?? false;
		this.t_info = p.read_key(T_Preference.info) ?? T_Report.focus;
		w_show_details.set(p.read_key(T_Preference.show_details) ?? false);
		w_show_related.set(p.read_key(T_Preference.show_related) ?? false);
	}

	reactivity_subscribe() {
		w_show_details.subscribe((flag: boolean) => {
			p.write_key(T_Preference.show_details, flag);
			w.restore_state();
			layout.grand_layout();
		});
		w_show_related.subscribe((flag: boolean) => {
			p.write_key(T_Preference.show_related, flag);
			w.restore_state();
			layout.grand_layout();
		});
    }
}

export let show = new Visibility();