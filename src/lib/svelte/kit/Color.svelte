<script lang='ts'>
	import { k, ux, Point, Thing, T_Layer, colors, signals } from '../../ts/common/Global_Imports';
	import { w_color_trigger, w_background_color } from '../../ts/common/Stores';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { onMount } from 'svelte';
	let {
		color_closure = (color: string | null): string | null => {},
		picker_offset = k.empty,
		origin = Point.zero } = $props();
	const pickerSize = 122;
	const selectorSize = k.dot_size + 1;
	let currentColor = $state($w_background_color);

	function handleColorChange(event) {
		event.preventDefault();
		const hex_color = event.detail.hex;
		if (currentColor !== hex_color) {
			currentColor = hex_color;
			color_closure(hex_color);
		}
	}

	$effect(() => {
		const newColor = $w_background_color;
		if (newColor !== currentColor) {
			currentColor = newColor;
		}
	});
</script>

<style>
	div :global(.wrapper) {
		left: var(--picker_offset);
		top: 24px;
	}

	div :global(.picker-indicator) {
		border-radius: 50%;
	}
</style>

<div class='color'
	style='
		top: {origin.y}px;
		left: {origin.x}px;
		position: absolute;
		z-index: {T_Layer.frontmost};
		--picker_offset: {picker_offset};'>
	<ColorPicker
		label=''
		hex={currentColor}
		--cp-border-color=black;
		on:input={handleColorChange}
		--input-size='{selectorSize}px'
		--picker-width='{pickerSize}px'
		--picker-height='{pickerSize}px'
		--slider-width='{selectorSize}px'
		--picker-z-index='{T_Layer.frontmost}'
		--picker-indicator-size='{selectorSize}px'/>
</div>
