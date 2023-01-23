import { defineConfig } from 'vitepress'
import locales from './locales'

export default defineConfig({
	base: `/pinia-plugin-persistedstate/`,
	title: 'pinia-plugin-persistedstate',
	description: '🍍 Configurable persistence and rehydration of Pinia stores.',
	head: [['link', { rel: 'icon', href: '/pinia-plugin-persistedstate/favicon.ico' }]],
	lastUpdated: true,
	locales: locales.vitepressConfig,
	markdown: {
		theme: {
			dark: 'vitesse-dark',
			light: 'vitesse-light',
		},
	},
	themeConfig: {
		logo: '/logo.png',
		locales: locales.themeConfig,
	},
})
