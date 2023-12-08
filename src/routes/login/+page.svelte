<script lang="ts">
	import { AuthClient } from '@dfinity/auth-client';
	import { onMount } from 'svelte';

	const HOST =
		import.meta.env.NODE_ENV !== 'development' // FIX
			? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`
			: 'https://identity.ic0.app/#authorize';

	let client: AuthClient | undefined = undefined;

	async function init() {
		client = await AuthClient.create({
			idleOptions: {
				disableIdle: true,
				disableDefaultIdleCallback: true
			}
		});
	}

	async function handleLogin() {
		await client?.login({
			maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
			onSuccess: () => handleSuccessfulLogin(),
			onError: (e) => handleError(e),
			identityProvider: HOST
		});
	}

	async function handleSuccessfulLogin() {
		try {
			const principal = client?.getIdentity()?.getPrincipal();
			console.log('logged in as', principal?.toText());
		} catch (e) {
			console.error('Error', e);
		}
	}

	function handleError(e?: string) {
		console.warn('Error while logging in using,', e);
	}

	onMount(() => init());
</script>

<div class="text-column">
	<h1>Login</h1>

	<button on:click={handleLogin}>click to login</button>
</div>
