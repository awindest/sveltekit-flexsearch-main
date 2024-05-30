<script>
	import { onMount } from 'svelte'
	import { createComponentsIndex, searchComponentsIndex } from '$lib/search'

	let search = 'loading' //'loading' | 'ready' 
	let searchTerm = 'imagine'
	let results = []

	// got the following from: https://stackoverflow.com/questions/62367770/json-accessing-specific-leaf-in-variable-depth-branches

	function getLeafComponentNames(data, depth = 0) {
		// if (!data.children) return [{ id: data.data.id, depth }]
		if (!data.children) {
		// console.log(data.data.id,' - -', data.data.description)
		return [{ "component" : data.data.id, "description": data.data.description}]
		}
		const searchData = []
		for (const child of data.children) {
			const n = getLeafComponentNames(child, depth + 1) // DFS recursive, depth increases by 1
			searchData.push(...n)
		}
		return searchData.filter(n => n)
	}

	onMount(async () => {
		const data = await fetch('/search.json').then((res) => res.json())
		let depth = 0
		const d = getLeafComponentNames(data, depth = 0)
		// console.log(posts)
		createComponentsIndex(d)
		search = 'ready'
	})

	$: if (search === 'ready') {
		results = searchComponentsIndex(searchTerm)
	}
</script>

{#if search === 'ready'}
	<div class="search">
		<input
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
		/>

		<div class="results">
			{#if results}
				<ul>
					{#each results as result}
						<li>
							<a href="/{result.component}">
								{@html result.component}
							</a>
							<p>{@html result.description}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}

<style>
	:global(body) {
		font-family: 'Manrope', sans-serif;
		font-size: 1.5rem;
		color: hsl(220 10% 98%);
		background-color: hsl(220 10% 10%);
	}

	.search {
		width: 90vw;
		max-width: 600px;
		position: fixed;
		left: 50%;
		top: 20%;
		translate: -50% -0%;
		border-radius: 0.5rem;
		box-shadow: 0px 0px 20px hsl(0 0% 0% / 40%);
		overflow: hidden;

		& input {
			width: 100%;
			padding: 1.5rem;
			color: hsl(220 10% 98%);
			background-color: hsl(220 10% 20%);
			font: inherit;
			border: none;
			outline: none;
		}
	}

	.results {
		max-height: 48vh;
		padding: 1.5rem;
		background-color: hsl(220 10% 14%);
		overflow-y: auto;
		scrollbar-width: thin;

		& ul {
			display: grid;
			gap: 1rem;
			padding: 0px;
			margin: 0px;
			list-style: none;

			& li:not(:last-child) {
				padding-block: 0.5rem;
				border-bottom: 1px solid hsl(220 10% 20%);
			}
		}

		& a {
			display: block;
			font-size: 1.5rem;
			color: hsl(220 10% 80%);
			text-decoration: none;
			transition: color 0.3s ease;

			&:hover {
				color: aqua;
			}
		}
	}
</style>
