import { defineConfig } from 'vitepress'

import { root } from './root'
import { zh } from './zh'

export default defineConfig({
	base: `/pinia-plugin-persistedstate/`,
	lastUpdated: true,
	markdown: {
		theme: {
			dark: 'vitesse-dark',
			light: 'vitesse-light',
		},
	},
	themeConfig: {
		logo: '/logo.png',
		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/prazdevs/pinia-plugin-persistedstate',
			},
		]
	},
	locales: {
		root,
		zh,
	},
})
