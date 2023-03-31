import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/open-branches' : '',
		},
		appDir: process.env.NODE_ENV === 'production' ? 'open-branches' : '_app',
	}
};

export default config;
