import { Rect, Point, Ancestry, Hierarchy, G_Cluster } from '../common/Global_Imports';
import { T_Graph, T_Hierarchy, T_Details, T_Startup } from '../common/Global_Imports';
import { S_Paging, S_Title_Edit, S_Alteration } from '../common/Global_Imports';
import { writable } from 'svelte/store';
import DBCommon from '../dbs/DBCommon';

// Ancestry related stores
export const w_ancestry_showing_tools = writable<Ancestry | null>(null);
export const w_ancestries_expanded = writable<Array<Ancestry>>([]);
export const w_ancestries_grabbed = writable<Array<Ancestry>>([]);
export const w_ancestry_focus = writable<Ancestry | null>(null);

// Core data stores
export const w_hierarchy = writable<Hierarchy | null>(null);
export const w_database = writable<DBCommon | null>(null);

// State stores
export const w_s_title_edit = writable<S_Title_Edit | null>(null);
export const w_s_alteration = writable<S_Alteration | null>(null);
export const w_s_paging = writable<S_Paging | null>(null);

// Type stores
export const w_t_countDots = writable<Array<T_Hierarchy>>([]);
export const w_t_details = writable<Array<T_Details>>([]);
export const w_t_graph = writable<T_Graph | null>(null);
export const w_t_tree = writable<T_Hierarchy | null>(null);
export const w_t_startup = writable<T_Startup>(T_Startup.start);
export const w_t_database = writable<string>('');

// Graph related stores
export const w_g_active_cluster = writable<G_Cluster | null>(null);
export const w_mouse_location_scaled = writable<Point | null>(null);
export const w_user_graph_center = writable<Point | null>(null);
export const w_user_graph_offset = writable<Point | null>(null);
export const w_mouse_location = writable<Point | null>(null);
export const w_graph_rect = writable<Rect | null>(null);

// UI and display stores
export const w_info_title = writable<string | null>(null);
export const w_id_popupView = writable<string | null>(null);
export const w_color_trigger = writable<string | null>(null);
export const w_thing_fontFamily = writable<string>('');
export const w_background_color = writable<string>('white');
export const w_storage_update_trigger = writable<number>(0);
export const w_ring_rotation_radius = writable<number>(0);
export const w_ring_rotation_angle = writable<number>(0);
export const w_count_mouse_up = writable<number>(0);
export const w_count_rebuild = writable<number>(0);
export const w_count_resize = writable<number>(0);
export const w_font_size = writable<number>(0);
export const w_show_related = writable<boolean>(false);
export const w_show_details = writable<boolean>(false);
export const w_device_isMobile = writable<boolean>(false);

class Stores {
	setup_defaults() {
		w_t_startup.set(T_Startup.start);
		w_color_trigger.set(null);
		w_count_mouse_up.set(0);
		w_count_rebuild.set(0);
		w_count_resize.set(0);
	}
}

export const stores = new Stores();
