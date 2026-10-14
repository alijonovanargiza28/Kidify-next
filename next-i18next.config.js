module.exports = {
	resources: {
		uz: { common: require('./public/locales/uz/common.json') },
		en: { common: require('./public/locales/en/common.json') },
		ko: { common: require('./public/locales/ko/common.json') },
	},
	i18n: { defaultLocale: 'en', locales: ['en', 'ko', 'uz'] },
};
