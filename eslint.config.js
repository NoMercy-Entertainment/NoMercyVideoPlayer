import antfu from '@antfu/eslint-config';

export default antfu({
	ignores: [
		'wiki/**',
		'public/js/**',
		'README.md',
		// Linting `eslint.config.js` itself triggers a full config-cache rebuild
		// on save (~70s on Windows with antfu's plugin set). Run `npx eslint
		// eslint.config.js` manually when editing this file.
		'eslint.config.js',
		// Has a pending uncommitted design tweak — CSS formatter must not touch it
		'src/plugins/desktop-ui/styles.css',
	],
	typescript: {
		overrides: {
			'no-async-promise-executor': 'off',
			'no-extend-native': 'off',
			'ts/method-signature-style': 'off',
			'unused-imports/no-unused-vars': 'warn',
		},
	},
	js: {
	},
	test: {
		overrides: {
			'test/prefer-lowercase-title': 'off',
			// vi.fn(function(this: unknown) {}) needs function for `this` context
			'prefer-arrow-callback': 'off',
			// Test mock constructors legitimately capture `this` for fixture access
			'ts/no-this-alias': 'off',
		},
	},
	stylistic: {
		indent: 'tab',
		quotes: 'single',
		semi: true,
	},
	formatters: {
		css: true,
		html: true,
		markdown: true,
		svg: false,
	},
}, {
	// Project uses `{ void expr; }` arrow bodies and one-liner stubs throughout
	rules: {
		'style/max-statements-per-line': 'off',
		'node/prefer-global/process': 'off',
	},
});
