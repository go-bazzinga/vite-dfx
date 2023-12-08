/* eslint-disable @typescript-eslint/no-explicit-any */
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// const prodCanisterJson = async () => await import('.dfx/local/canister_ids.json');

const DFX_PORT = 4943;

const devCanisterJson = async () => {
	try {
		return await import(
			//@ts-ignore
			'./.dfx/local/canister_ids.json'
		);
	} catch (e) {
		console.error('⚠️ Error finding dev canister JSON. Did you forget to run `dfx deploy`?', e);
		return {};
	}
};

const isDev = process.env.NODE_ENV !== 'production';

// const canisterIds = isDev ? await devCanisterJson() : await prodCanisterJson();
const canisterIds = await devCanisterJson();

const canisterDefinitions = Object.entries(canisterIds).reduce(
	(acc, [key, val]) => ({
		...acc,
		[`process.env.${key.toUpperCase()}_CANISTER_ID`]: isDev
			? JSON.stringify((val as any).local)
			: JSON.stringify((val as any).ic)
	}),
	{}
);

console.log(canisterDefinitions);

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			// https://github.com/vitejs/vite/discussions/2785#discussioncomment-4738116
			// Whether to polyfill `node:` protocol imports.
			protocolImports: true
		})
	],
	server: {
		fs: {
			allow: ['../']
		},
		proxy: {
			// This proxies all http requests made to /api to our running dfx instance
			'/api': {
				target: `http://0.0.0.0:${DFX_PORT}`
			}
		}
	},
	define: {
		// Here we can define global constants
		...canisterDefinitions
		// 'process.env.INTERNET_IDENTITY_CANISTER_ID': JSON.stringify('qhbym-qaaaa-aaaaa-aaafq-cai'),
	}
});
