<script lang='ts'>
	import { k, T_Layer } from '../../ts/common/Global_Imports';
	import type { Integer } from '../../ts/common/Types';
	interface Props {
		width?: number;
		top?: number;
		array: any;
	}

	let { width = 180, top = 0, array }: Props = $props();
	let table = $state();

	function location_ofCellAt(x: Integer, y: Integer): Point {
		const rows = table.rows;
		if (x >= rows.length) {
		  console.error('Row index out of bounds');
		}
		const row = rows[x];
		const cells = row.cells;
		if (y >= cells.length) {
		  console.error('Column index out of bounds');
		}
		const cell = cells[y];
		const rect = cell.getBoundingClientRect();
		return new Point(rect.left, rect.top);
	}

</script>

<style>
	.first {
		border-right: 1px solid transparent;
		text-align: right;
		line-height:12px;
		color:black;
		width: 30%;
	}
	.second {
		line-height:12px;
	}
</style>

{#if array}
	<div class='ancestry-info'
		bind:this={table}
		style='
			left:10px;
			top:{top}px;
			position:absolute;
			z-index: {T_Layer.details};'>
		<table style='width: {width}px; left:12px; color:black;'>
			{#each array as [key, value]}
				<tr>
					<td class='first'>{key}:</td>
					<td class='second'>{value}</td>
				</tr>
			{/each}
		</table>
	</div>
{/if}
