<script lang='ts'>
	import { k, Rect, Size, Point, debug, colors, svgPaths } from '../../ts/common/Global_Imports';
	import { T_Layer, T_Oblong, G_Segment } from '../../ts/common/Global_Imports';
	import { w_background_color } from '../../ts/common/Stores';
	import Mouse_Responder from './Mouse_Responder.svelte';
	interface Props {
		hit_closure?: any;
		fill?: any;
		g_segment: G_Segment;
		name?: any;
		stroke?: any;
	}

	let {
		hit_closure = (title, shift) => {},
		fill = $bindable($w_background_color),
		g_segment,
		name = g_segment.title,
		stroke = colors.default
	}: Props = $props();
	const segment_name = `${name}-segment`;
	let title_color = $state(colors.default);
	let size = g_segment.size;
	let isHovering = $state(false);

	update_colors();

	function update_colors() {
		title_color = isHovering ? $w_background_color : colors.default ;
		fill = isHovering ? colors.default : g_segment.isSelected ? colors.opacitize('skyblue', 0.6) : $w_background_color;
		debug.log_segments(`${name} ${g_segment.isSelected ? 'selected' : ''} ${fill}`)
	}

	function up_hover_closure(s_mouse) {
		if (s_mouse.isHover) {
			isHovering = !s_mouse.isOut;
		} else if (s_mouse.isUp) {
			hit_closure(name, s_mouse.event?.isShift ?? false);
		}
		update_colors();
	}

</script>

<Mouse_Responder
	cursor='pointer'
	width={size.width}
	name={segment_name}
	height={size.height}
	zindex={T_Layer.frontmost}
	origin={g_segment.origin}
	handle_mouse_state={up_hover_closure}>
	<svg
		id={`${name}`}
		class='segment-svg'
		viewBox={g_segment.viewBox}
		style='
			height:{size.height}px;
			width:{size.width}px;
			position: absolute;
			left:0px;'>
		<path
			class='segment-path'
			d={g_segment.path}
			stroke-width=0.3px
			stroke={stroke}
			id={`${name}`}
			fill={fill}/>
	</svg>
	<div
		class='title'
		style='
			left:{g_segment.title_origin.x}px;
			top:{g_segment.title_origin.y}px;
			color:{title_color};
			position:absolute;'>
		{g_segment.title}
	</div>
</Mouse_Responder>
