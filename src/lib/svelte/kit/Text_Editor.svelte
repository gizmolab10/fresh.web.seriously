<script lang='ts'>
	import { k, u, ux, debug, colors, T_Layer, databases } from '../../ts/common/Global_Imports';
	import { w_thing_fontFamily, w_background_color } from '../../ts/common/Stores';
	interface Props {
		handle_textChange?: any;
		color?: any;
		width?: any;
		original_text?: any;
		label?: any;
		height?: number;
		left?: number;
		top?: number;
	}

	let {
		handle_textChange = (label: string, text: string) => {},
		color = colors.default_forThings,
		width = k.width_details - 40,
		original_text = k.empty,
		label = k.empty,
		height = 200,
		left = 0,
		top = 0
	}: Props = $props();
	let textarea = $state(null);
	let bound_text = $state(original_text);
	let cursorStyle = 'cursor: text';
	let label_left = (k.width_details - 28 - u.getWidthOf(label) * 0.7) / 2;

	function handle_focus(event: Event) { ux.isEditing_text = true; }
	function handle_keyup(event: KeyboardEvent) { handle_key(false, event); }
	function handle_keydown(event: KeyboardEvent) { handle_key(true, event); }
	function handle_blur(event: Event) {
		handle_textChange(label, null);
		ux.isEditing_text = false;
	}

	function handle_key(down: boolean, event: KeyboardEvent) {

		// ignore down and !exit because textarea value is not [yet] altered until key up
		// ignore up and exit so altered text is ignored (result won't include an extraneous RETURN)
		
		const exit = event.key == 'Enter' && !event.shiftKey;
		if (down && exit) {
			event.preventDefault();
			textarea.blur();
			textarea.value = bound_text;
		} else if (!down && !exit) {
			const text = textarea.value;
			if (!!text || text == k.empty) {
				bound_text = text;
				handle_textChange(label, text);
			}
		}
	}

</script>

<style lang='scss'>
	textarea:focus {
		outline: none;
		border: 0.5px dashed black;
	}
	textarea:blur {
		outline: none;
		border: 0.5px solid black;
	}
</style>

<div class={label}
	style='
		top: {top}px;
		left: {left}px;
		position: absolute;'>
	<textarea
		id={label}
		type='text'
		name='text'
		wrap='soft'
		class='text'
		bind:this={textarea}
		onblur={handle_blur}
		bind:value={bound_text}
		onfocus={handle_focus}
		onkeyup={handle_keyup}
		onkeydown={handle_keydown}
		style='
			resize: none;
			padding: 6px;
			{cursorStyle};
			color: {color};
			width: {width}px;
			height: {height}px;
			overflow-x: hidden;
			vertical-align: top;
			white-space: normal;
			z-index: {T_Layer.text};
			overflow-wrap: break-word;
			{k.prevent_selection_style};
			font-family: {$w_thing_fontFamily};
			border-radius: {k.row_height / 2}px;
		'></textarea>
	<div style='
		top: -8px;
		color: gray;
		font-size: 0.9em;
		padding: 0px 3px;
		position: absolute;
		left: {label_left}px;
		background-color: {$w_background_color}'>
		{label}
	</div>
</div>
