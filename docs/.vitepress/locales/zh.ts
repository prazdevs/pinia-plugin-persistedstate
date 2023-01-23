import { version } from '../../../packages/plugin/package.json'
const currentVersion = `v${version}`

export default {
	vitepressConfig: {
		title: 'Pinia 持久化存储',
		lang: 'zh',
		description: '🍍 Pinia 可配置的持久性存储以及数据填充',
	},
	themeConfig: {
		label: '简体中文',
		selectText: '选择语言',
		editLinkText: '对本页提出修改建议',
		lastUpdated: '最后更新',

		footer: {
			message: '根据 MIT 许可证发布',
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
			text: '在 GitHub 上编辑此页面',
		},

		nav: [
			{
				text: '指南',
				link: '/zh/guide/',
				activeMatch: '/zh/guide/',
			},
			{
				text: '框架',
				activeMatch: '/zh/frameworks/',
				items: [
					{
						text: 'Nuxt 3',
						link: '/zh/frameworks/nuxt-3',
						activeMatch: '/zh/frameworks/nuxt-3',
					},
				],
			},
			{
				text: '选择语言',
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
								text: '发行说明',
								link: 'https://github.com/prazdevs/pinia-plugin-persistedstate/releases',
							},
						],
					},
					{
						text: '版本',
						items: [
							{
								text: `${currentVersion} (当前)`,
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
			'/zh/': [
				{
					text: '指南',
					items: [
						{
							text: '为什么你应该使用该插件？',
							link: '/zh/guide/why',
						},
						{
							text: '开始',
							link: '/zh/guide/',
						},
						{
							text: '配置',
							link: '/zh/guide/config',
						},
						{
							text: '局限性',
							link: '/zh/guide/limitations',
						},
						{
							text: '进阶用法',
							link: '/zh/guide/advanced',
						},
						{
							text: '从 v2 迁移',
							link: '/zh/guide/migrating',
						},
					],
				},
				{
					text: '框架',
					items: [
						{
							text: 'Nuxt 3',
							link: '/zh/frameworks/nuxt-3',
						},
					],
				},
			],
		},
	},
}
