<script lang='ts'>
	import { c, k, u, show, Point, debug, layout, T_Layer, T_Banner, T_Details } from '../../ts/common/Global_Imports';
	import { w_graph_rect, w_t_details } from '../../ts/common/Stores';
	import { w_background_color } from '../../ts/common/Stores';
	import D_Display from '../details/D_Display.svelte';
	import D_Storage from '../details/D_Storage.svelte';
	import Segmented from '../mouse/Segmented.svelte';
	import Separator from '../kit/Separator.svelte';
	// import D_Tools from '../details/D_Tools.svelte';
	import D_Info from '../details/D_Info.svelte';
	const titles = [T_Details[T_Details.storage], T_Details[T_Details.tools], T_Details[T_Details.display], T_Details[T_Details.info]];
	let details_rebuilds = $state(0);

	layout.layout_tops_forDetails();

	function selection_closure(t_details: Array<string>) {
		$w_t_details = t_details as Array<T_Details>;
		layout.layout_tops_forDetails();
		details_rebuilds += 1;
	}

	function showingDetails_ofType(t_details: T_Details): boolean {
		return $w_t_details.includes(T_Details[t_details])
	}

</script>

{#key details_rebuilds}
	<div class='details'
		style='
			left:0px;
			position:fixed;
			z-index:{T_Layer.details};
			width:{k.width_details}px;
			top:{$w_graph_rect.origin.y}px;
			height:{$w_graph_rect.size.height}px;'>
		<Segmented
			titles={titles}
			allow_multiple={true}
			name='details-selector'
			selected={$w_t_details}
			origin={new Point(6, 6)}
			selection_closure={selection_closure}/>
		{#if showingDetails_ofType(T_Details.storage)}
			<Separator title='storage' top={layout.top_ofDetailAt(T_Details.storage) - 8}/>
			<D_Storage top={layout.top_ofDetailAt(T_Details.storage)}/>
		{/if}
		<div class='further-details'
			style='width:{k.width_details}px;'>
			{#if showingDetails_ofType(T_Details.tools)}
				<Separator title='tools' top={layout.top_ofDetailAt(T_Details.tools) - 8}/>
				<D_Tools top={layout.top_ofDetailAt(T_Details.tools)}/>
			{/if}
			{#if showingDetails_ofType(T_Details.display)}
				<Separator title='display' top={layout.top_ofDetailAt(T_Details.display) - 8}/>
				<D_Display top={layout.top_ofDetailAt(T_Details.display)}/>
			{/if}
			{#if showingDetails_ofType(T_Details.info)}
				<Separator title='info' top={layout.top_ofDetailAt(T_Details.info) - 7}/>
				<D_Info top={layout.top_ofDetailAt(T_Details.info)}/>
			{/if}
		</div>
	</div>
{/key}
