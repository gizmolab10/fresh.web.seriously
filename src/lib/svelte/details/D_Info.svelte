<script lang='ts'>
	import { T_Info, T_Trait, T_Layer, T_Element, T_Report, T_Preference } from '../../ts/common/Global_Imports';
	import { w_hierarchy, w_color_trigger, w_info_title, w_background_color, } from '../../ts/common/Stores';
	import { w_ancestry_focus, w_ancestries_grabbed, w_thing_fontFamily } from '../../ts/common/Stores';
	import { c, k, p, ux, show, Rect, Size, Point, Thing } from '../../ts/common/Global_Imports';
	import { debug, colors, signals, layout, Ancestry } from '../../ts/common/Global_Imports';
	import type { Integer, Dictionary } from '../../ts/common/Types';
	import Identifiable from '../../ts/runtime/Identifiable';
	// import Text_Editor from '../kit/Text_Editor.svelte';
	import Segmented from '../mouse/Segmented.svelte';
	import Separator from '../kit/Separator.svelte';
	import Color from '../kit/Color.svelte';
	import Table from '../kit/Table.svelte';
	import { run } from 'svelte/legacy';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	interface Props {
		top?: number;
	}

	let { top = 0 }: Props = $props();
	const id = 'info';
	const margin = 10;
	const font_ratio = 0.8;
	const text_top = top + 52;
	const font_size = `${font_ratio}em`;
	const info_width = k.width_details - 30;
	const separator_font_size = `${k.tiny_font_size}px`;
	const traits_center = new Point(122, text_top - 20);
	const traits_width = k.width_details - (margin * 2);
	const traits_size = new Size(info_width - 58, k.default_buttonSize + 4);
	const traits_rect = Rect.createCenterRect(traits_center, traits_size);
	const es_info = ux.s_element_for(new Identifiable(id), T_Element.info, id);
	let ancestry: Ancestry | null = $state(get(w_ancestry_focus));
	let thing: Thing | null = $state(ancestry?.thing ?? null);
	let text_box_size = new Size(info_width - 4, 68);
	let thingHID: Integer | null = thing?.hid;
	let information: Array<Dictionary> = $state([]);
	let color = $state(colors.default_forThings);
	let thing_title = $state(thing?.title);
	let color_origin = $state(Point.zero);
	let picker_offset = $state(k.empty);
	let info_rebuilds = $state(0);
	let info;

	layout.layout_tops_forInfo(1);
	setup_forColor();	// must call layout_tops_forInfo first
	es_info.set_forHovering(colors.default, 'pointer');
	
	onMount(() => {
		const handler = signals.handle_rebuild_andRecreate(1, (ancestry) => {
			info_rebuilds += 1;
		});
		return () => { handler.disconnect() };
	});
	
	function hasGrabs(): boolean {
		return !!get(w_ancestries_grabbed) && ($w_ancestries_grabbed.length > 1 || (!!get(w_ancestry_focus) && !get(w_ancestry_focus).isGrabbed));
	}

	function selection_closure(t_infos: Array<string>) {
		const t_info = t_infos[0];
		p.write_key(T_Preference.info, t_info);
		show.t_info = t_info;
		update_forKind();
	}
	
	function setup_forColor() {
		const color_left = 61
		color_origin = new Point(color_left, layout.top_ofInfoAt(T_Info.color));
		picker_offset = `${-color_left - 10}px`;
	}

	function update_forKind() {
		if (show.t_info == T_Report.focus || !hasGrabs()) {
			ancestry = get(w_ancestry_focus);
		} else {
			if (!!get(w_ancestries_grabbed) && get(w_ancestries_grabbed).length > 0) {
				ancestry = get(w_ancestries_grabbed)[0];
			}
		}
		update_forAncestry();
	}

	function update_forAncestry() {
		thing = ancestry?.thing;
		if (!!thing) {
			thing_title = thing.title;
			thingHID = thing.hid;
			const dict = {
				'depth'	   : ancestry.depth.expressZero_asHyphen(),
				'parent'   : ancestry.predicate.kind,
				'order'	   : ancestry.relationship?.order ?? 0,
				'children' : ancestry.children.length.expressZero_asHyphen(),
				'progeny'  : ancestry.progeny_count().expressZero_asHyphen(),
				'parents'  : thing.parents.length.expressZero_asHyphen(),
				'related'  : thing.relatedRelationships.length.expressZero_asHyphen(),
				'id'	   : thing.id.clipWithEllipsisAt(13),
				'ancestry' : ancestry.id.clipWithEllipsisAt(13),
				'color'	   : k.empty,
			};
			information = Object.entries(dict);
			debug.log_info(information)
			info_rebuilds += 1;
		}
	}

	function handle_textChange(label: string, text: string | null) {
		if (!!thing && (!!text || text == k.empty)) {
			switch (label) {
				case 'quest':		thing.setTraitText_forType(text, T_Trait.quest);		 break;
				case 'consequence':	thing.setTraitText_forType(text, T_Trait.consequence); break;
			}
		} else if (!text) {		// do after test for k.empty, which also is interpreted as falsey
			(async () => {
				await $w_hierarchy.db.persist_all();
			})();
		}
	}

	function handle_colors(result: string | null): string | null {
		if (!result) {
			return thing.color;
		} else {
			thing.color = result;
			thing.signal_color_change();
			(async () => {
				await thing.persist();
			})();
			return null;
		}
	}

	$effect(() => {
		const _ = `${get(w_ancestries_grabbed)} ${get(w_ancestry_focus)} ${$w_info_title}`;
		update_forKind();
	});
	$effect(() => {
		if (thing != ancestry?.thing) {
			update_forAncestry();
		}
	});
	$effect(() => {
		const _ = $w_background_color;
		info_rebuilds += 1;
	});
	$effect(() => {
		const id = $w_color_trigger;
		if (!!thing && thing.id == id) {
			color = thing.color;
			info_rebuilds += 1;
		}
	});
</script>

{#key info_rebuilds}
	{#if !!thing}
		<div class='info'
			style='
				color:black;
				top:{top}px;
				left:{margin}px;
				font-size:0.8em;
				position:absolute;
				width:{traits_width}px;'>
			{#if information.length != 0}
				<Segmented
					name='info-type'
					font_size={font_size}
					selected={[show.t_info]}
					height={k.row_height * font_ratio}
					selection_closure={selection_closure}
					titles={[T_Report.focus, T_Report.selection]}
					origin={new Point(45, layout.top_ofInfoAt(T_Info.segments))}/>
				<Separator
					left=5
					title='title'
					width={info_width}
					thickness={k.separator_thickness}
					title_font_size={separator_font_size}
					top={layout.top_ofInfoAt(T_Info.before_title)}/>
				{#key thing_title}
					<div style='
						white-space:pre;
						position:absolute;
						text-align:center;
						width:{traits_width}px;
						top:{layout.top_ofInfoAt(T_Info.title)}px;'>
						{thing_title.clipWithEllipsisAt(30)}
					</div>
				{/key}
				<Separator
					left=5
					width={info_width}
					thickness={k.separator_thickness}
					top={layout.top_ofInfoAt(T_Info.after_title)}/>
				<Table
					array={information}
					width = {k.width_details - 20}
					top = {layout.top_ofInfoAt(T_Info.table)}/>
			{/if}
			<Color
				origin={color_origin}
				color_closure={handle_colors}
				picker_offset={picker_offset}/>
			{#if show.traits}
				<!-- div class='horizontal-line'
					style='
						left:{-margin}px;
						position:absolute;
						width:{k.width_details}px;
						z-index:{T_Layer.frontmost};
						height:{k.separator_thickness}px;
						background-color:{colors.separator};'>
				</div>
				<Text_Editor
					label='consequence'
					color=colors.default
					width={text_box_size.width}
					height={text_box_size.height}
					original_text={thing.consequence}
					handle_textChange={handle_textChange}
					top={layout.top_ofInfoAt(T_Info.consequence)}/>
				<Text_Editor
					label='quest'
					color=colors.default
					original_text={thing.quest}
					width={text_box_size.width}
					height={text_box_size.height}
					handle_textChange={handle_textChange}
					top={layout.top_ofInfoAt(T_Info.quest)}/-->
			{/if}
		</div>
	{/if}
{/key}
