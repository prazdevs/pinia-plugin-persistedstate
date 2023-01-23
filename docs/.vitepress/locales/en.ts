import { version } from '../../../packages/plugin/package.json'
const currentVersion = `v${version}`

export default {
	vitepressConfig: {
		title: 'pinia-plugin-persistedstate',
		lang: 'en-US',
		description: '🍍 Configurable persistence and rehydration of Pinia stores.',
	},
	themeConfig: {
		label: 'English',
		selectText: 'Languages',
		editLinkText: 'Suggest changes to this page',
		lastUpdated: 'Last Updated',

		footer: {
			message: 'Released under the MIT License.',
			copyright: `Copyright © 2021-${new Date().getFullYear()} prazdevs & contributors`,
		},

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/prazdevs/pinia-plugin-persistedstate',
			},
		],

		editLink: {
			pattern: 'https://github.com/prazdevs/pinia-plugin-persistedstate/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},

		nav: [
			{
				text: 'Guide',
				link: '/guide/',
				activeMatch: '/guide/',
			},
			{
				text: 'Frameworks',
				activeMatch: '/frameworks/',
				items: [
					{
						text: 'Nuxt 3',
						link: '/frameworks/nuxt-3',
						activeMatch: '/frameworks/nuxt-3',
					},
				],
			},
			{
				text: 'Languages',
				items: [
					{
						text: 'English',
						link: '/',
						activeMatch: '/',
					},
					{
						text: '简体中文',
						link: '/zh/',
						activeMatch: '/zh/',
					},
				],
			},
			{
				text: currentVersion,
				items: [
					{
						items: [
							{
								text: 'Release Notes',
								link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/releases',
							},
						],
					},
					{
						text: 'Versions',
						items: [
							{
								text: `${currentVersion} (Current)`,
								activeMatch: '/',
								link: '/',
							},
							{
								text: 'v2.4.0',
								link: 'https://prazdevs.github.io/pinia-plugin-persistedstate-v2/',
							},
							{
								text: 'v1.6.3',
								link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/blob/45046f09b62ff4f17fb432cc9ca61649675a6f75/README.md',
							},
						],
					},
				],
			},
		],

		sidebar: {
			'/': [
				{
					text: 'Guide',
					items: [
						{
							text: 'Why this plugin?',
							link: '/guide/why',
						},
						{
							text: 'Getting Started',
							link: '/guide/',
						},
						{
							text: 'Configuration',
							link: '/guide/config',
						},
						{
							text: 'Limitations',
							link: '/guide/limitations',
						},
						{
							text: 'Advanced Usage',
							link: '/guide/advanced',
						},
						{
							text: 'Migrating from v2',
							link: '/guide/migrating',
						},
					],
				},
				{
					text: 'Frameworks',
					items: [
						{
							text: 'Nuxt 3',
							link: '/frameworks/nuxt-3',
						},
					],
				},
			],
		},
	},
}
