<script lang='ts'>
	import { colors, debug, layout, Ancestry, Hierarchy, databases } from '../../ts/common/Global_Imports';
	import { c, k, u, ux, w, show, Rect, Size, Point, Thing } from '../../ts/common/Global_Imports';
	import { w_s_title_edit, w_show_details, w_device_isMobile, } from '../../ts/common/Stores';
	import { T_Layer, T_Banner, T_Control, T_Startup } from '../../ts/common/Global_Imports';
	import { w_t_startup, w_id_popupView, w_ancestry_focus } from '../../ts/common/Stores';
	import { w_hierarchy, w_database, w_t_database } from '../../ts/common/Stores';
	import { w_graph_rect, w_background_color } from '../../ts/common/Stores';
	// import Mouse_Responder from '../mouse/Mouse_Responder.svelte';
	// import { T_Database } from '../../ts/common/Enumerations';
	import Details from '../details/Details.svelte';
	// import Breadcrumbs from './Breadcrumbs.svelte';
	// import BuildNotes from './BuildNotes.svelte';
	// import Graph from '../graph/Graph.svelte';
	import Controls from './Controls.svelte';
	// import Import from './Import.svelte';
	import { run } from 'svelte/legacy';
	import { onMount } from 'svelte';

	let separator_rebuilds = 0;
	let panel_rebuilds = 0;
	let chain = ['Panel'];
	let last_bg_color = '';
	let last_panel_state = '';

	function ignore_wheel(event) { event.preventDefault(); }

	$effect(() => {
		const database = $w_database;
		const t_database = $w_t_database;
		const t_startup = $w_t_startup;
		const id_popupView = $w_id_popupView;
		const graph_rect = $w_graph_rect;
		
		// Create a unique state string to detect actual changes
		// Only trigger rebuild if we have actual changes
		if (database && t_database && t_startup && id_popupView && graph_rect) {
			panel_rebuilds += 1;
		}
	});

	$effect(() => {
		const bg_color = $w_background_color;
		// Only trigger rebuild if we have a valid background color
		if (bg_color) {
			separator_rebuilds += 1;
		}
	});
	
	async function handle_key_down(event) {
		if (event.type == 'keydown') {
			const key = event.key.toLowerCase();
			if (key == undefined) {
				alert('No key for ' + event.type);
			} else if (!$w_s_title_edit && !ux.isEditing_text) {			// let title editor (when active) consume the events
				const h = $w_hierarchy;
				switch (key) {
					case 'o': h.select_file_toUpload(event.shiftKey); break;
					case 'c': w.user_graph_offset_setTo(Point.zero); break;
					case 'm': layout.toggle_t_graph(); break;
					case 's': h.persist_toFile(); break;
					case '?': c.showHelp(); break;
					default:  await h.handle_key_down(event); return;	// let hierarchy consume the events
				}
				debug.log_key(`PANEL  ${key}`);
			}
		}
	}

		// {#if [T_Startup.start, T_Startup.fetch].includes($w_t_startup) && $w_database.isPersistent}

			// {#if !$w_id_popupView}
			// 	<div class='breadcrumbs'
			// 		style='left:0px;
			// 			position: absolute;
			// 			z-index: {T_Layer.frontmost};
			// 			width:{w.windowSize.width}px;
			// 			top:{layout.top_ofBannerAt(T_Banner.crumbs) - 2}px;
			// 			height:{layout.height_ofBannerAt(T_Banner.crumbs)}px;'>
			// 		<Breadcrumbs/>
			// 		{#key separator_rebuilds}
			// 			<div class='separator-above-crumbs' style='
			// 				top: {layout.top_ofBannerAt(T_Banner.crumbs) - 3}px;
			// 				background-color:{colors.separator};
			// 				height: {k.separator_thickness}px;
			// 				z-index: {T_Layer.lines};'>
			// 			</div>
			// 		{/key}
			// 	</div>
			// 	{#key separator_rebuilds}
			// 		<div class='separator-above-graph' style='
			// 			top: {layout.top_ofBannerAt(T_Banner.graph)}px;
			// 			background-color: {colors.separator};
			// 			height: {k.separator_thickness}px;
			// 			width: {w.windowSize.width}px;
			// 			z-index: {T_Layer.lines};
			// 			position: absolute;
			// 			left: 0px;'>
			// 		</div>
			// 	{/key}
			// {/if}
			// <div class='right-side'
			// 	style='
			// 		height: 100%;
			// 		position: fixed;
			// 		z-index: {T_Layer.common};
			// 		left: {$w_show_details ? k.width_details : 0}px;'>
			// 	{#key $w_id_popupView}
			// 		{#if $w_id_popupView == T_Control.builds}
			// 			<BuildNotes/>
			// 		{:else if $w_id_popupView == T_Control.import}
			// 			<Import accept='.json'/>
			// 		{:else if !$w_id_popupView}
			// 			<Graph/>
			// 		{/if}
			// 	{/key}
			// </div>

</script>

<svelte:document onkeydown={handle_key_down}/>
{#key panel_rebuilds}
	<div style='
		touch-action: none;
		pointer-events: auto;
		{k.prevent_selection_style};'
		onwheel={ignore_wheel}>
		{#if [T_Startup.start, T_Startup.fetch].includes($w_t_startup as T_Startup)}
			<p>Welcome to Seriously</p>
			{#if $w_t_startup === T_Startup.fetch && $w_database && $w_database.isPersistent}
				<p>{databases.startupExplanation}</p>
			{/if}
		{:else if $w_t_startup === T_Startup.empty}
			<p>Nothing is available.</p>
		{:else if $w_t_startup === T_Startup.ready}
			<Controls/>
		{/if}
		{#if !$w_id_popupView && $w_show_details}
			<Details/>
			{#if separator_rebuilds > 0}
				<div class='vertical-line'
					style='
						position: absolute;
						z-index: {T_Layer.lines};
						left: {k.width_details}px;
						top: {$w_graph_rect?.origin.y}px;
						width: {k.separator_thickness}px;
						background-color: {colors.separator};
						height: {$w_graph_rect?.size.height}px;'>
				</div>
			{/if}
		{/if}
	</div>
{/key}

<style>
	p {
		text-align: center;
		font-size: 3em;
	}
</style>
