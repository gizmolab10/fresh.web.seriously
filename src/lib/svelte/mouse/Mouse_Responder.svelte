<script lang='ts'>
	import { run } from 'svelte/legacy';

	import { T_Layer, T_Timer, Mouse_Timer, S_Mouse } from '../../ts/common/Global_Imports';
	import { k, c, u, ux, Rect, Size, Point, debug } from '../../ts/common/Global_Imports';
	import { w_mouse_location, w_thing_fontFamily } from '../../ts/common/Stores';
	import type { Handle_Result } from '../../ts/common/Types';
	import { onMount } from 'svelte';
	interface Props {
		handle_isHit?: () => {flag: boolean} | null;
		handle_mouse_state?: Handle_Result<S_Mouse>;
		height?: any;
		width?: any;
		origin?: Point | null;
		center?: Point | null;
		detect_doubleClick?: boolean;
		detect_longClick?: boolean;
		detect_mouseDown?: boolean;
		detect_mouseUp?: boolean;
		position?: string;
		zindex?: any;
		font_size?: string;
		cursor?: string;
		align_left?: boolean;
		name?: string;
		children?: import('svelte').Snippet;
	}

	let {
		handle_isHit = null,
		handle_mouse_state = (s_mouse: S_Mouse) => {},
		height = k.default_buttonSize,
		width = k.default_buttonSize,
		origin = null,
		center = null,
		detect_doubleClick = false,
		detect_longClick = false,
		detect_mouseDown = true,
		detect_mouseUp = true,
		position = 'absolute',
		zindex = T_Layer.dots,
		font_size = '0.9em',
		cursor = 'pointer',
		align_left = true,
		name = 'generic',
		children
	}: Props = $props();
	const s_mouse = $state(ux.s_mouse_forName(name));	// persist across destroy/recreate
	const mouse_timer = ux.mouse_timer_forName(name);	// persist across destroy/recreate
	const mouse_responder_number = ux.next_mouse_responder_number;
	let mouse_isDown = false;
	let style = $state(k.empty);
	let bound_element = $state();

	//////////////////////////////////////////////////////////////
	//															//
	//	required: width, height, name,							//
	//		handle_mouse_state closure (*),						//
	//  	center or origin (one must remain null)				//
	//  optional: handle_isHit closure (*)						//
	//															//
	//  (*)	handle_isHit: override for hit geometry & logic		//
	//	(*)	handle_mouse_state: mouse info relevant to caller:	//
	//		down, up, double, long & hover						//
	//															//
	//////////////////////////////////////////////////////////////

	onMount(() => {
		setupStyle();
		if (!!bound_element) {
			bound_element.addEventListener('pointerup', handle_pointerUp);
			bound_element.addEventListener('pointerdown', handle_pointerDown);
			return () => {
				bound_element.removeEventListener('pointerup', handle_pointerUp);
				bound_element.removeEventListener('pointerdown', handle_pointerDown);
			}
		}
	});

	

	function reset() {	// tear down
		s_mouse.clicks = 0;
		mouse_timer.reset();
	}

	function create_state(isDown: boolean, isDouble: boolean = false, isLong: boolean = false): S_Mouse {
		const state = u.copyObject(s_mouse);
		state.isUp = !isDown && !isDouble && !isLong;
		state.element = bound_element;
		state.isDouble = isDouble;
		state.isLong = isLong;
		state.isHover = false;
		state.isDown = isDown;
		mouse_isDown = isDown;
		state.event = event;
		return state;
	}

	function handle_pointerUp(event) {
		if (detect_mouseUp) {
			reset();
			handle_mouse_state(S_Mouse.up(event, bound_element));
			debug.log_action(` up ${mouse_responder_number} RESPONDER`);
		}
	}
	
	function handle_pointerDown(event) {
		if (detect_mouseDown && s_mouse.clicks == 0) {
			handle_mouse_state(create_state(true));
		}
		s_mouse.clicks += 1;
		if (detect_doubleClick) {
			mouse_timer.setTimeout(T_Timer.double, () => {
				if (mouse_timer.hasTimer && s_mouse.clicks == 2) {
					reset();
					handle_mouse_state(create_state(false, true, false));
				}
			});
		}
		if (detect_longClick) {
			mouse_timer.setTimeout(T_Timer.long, () => {
				if (mouse_timer.hasTimer) {
					reset();
					handle_mouse_state(create_state(false, false, true));
					debug.log_action(` long ${mouse_responder_number} RESPONDER`);
				}
			});
		}
	}

	function setupStyle() {
		style = `
			width: ${width}px;
			z-index: ${zindex};
			height: ${height}px;
			position: ${position};
			font-size: ${font_size};
			font-family: ${$w_thing_fontFamily};
			`.removeWhiteSpace();
		if (!!cursor) {
			style = `${style} cursor: ${cursor};`;
		}
		if (!!origin || !!center) {
			const x = origin?.x ?? center?.x - width / 2;
			const y = origin?.y ?? center?.y - height / 2;
			const alignment = align_left ? 'left: ' : 'right: ';
			style = `${style} ${alignment}${x}px; top: ${y}px;`;
		}
	}

	run(() => {
		const _ = center;
		setupStyle();
	});
	run(() => {	// hover
		const mouse_location = $w_mouse_location;
		if (!!bound_element && !!mouse_location) {
			let isHit = false;
			if (!!handle_isHit) {
				isHit = handle_isHit();				// used when this element's hover shape is not its bounding rect
			} else {					
				isHit = Rect.rect_forElement_containsPoint(bound_element, mouse_location);		// use bounding rect
			}
			if (s_mouse.isHover != isHit) {
				s_mouse.isHover  = isHit;
				s_mouse.isOut   = !isHit;												// TODO: called far too often
				handle_mouse_state(S_Mouse.hover(null, bound_element, isHit));					// pass a null event
			}
		}
	});
</script>

<div class='mouse-responder' id={name}
	bind:this={bound_element}
	style={style}>
	{@render children?.()}
</div>
