<script lang="ts">
	import { onMount } from 'svelte';
	import { canisterId, createActor } from '../../../declarations/configuration/index';
	import { HttpAgent } from '@dfinity/agent';

	async function setup() {
		const actor = createActor('efsfj-sqaaa-aaaap-qatwa-cai', {
			agentOptions: {
				host: 'https://ic0.app'
			}
		}); // To query prod

		const actor2 = createActor(canisterId); // To query locally
		console.log('calling signup config');

		const res = await actor.get_current_list_of_all_well_known_principal_values();
		console.log('server res', { res });
	}

	onMount(() => {
		setup();
	});
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About this app</h1>

	<p>
		This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
		following into your command line and following the prompts:
	</p>

	<pre>npm create svelte@latest</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>
</div>
