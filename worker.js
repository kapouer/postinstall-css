const postcss = require('postcss');
const postcssUrl = require("postcss-url");
const postcssImport = require('postcss-import');
const postcssFlexBugs = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const reporter = require('postcss-reporter');

const defaultPlugins = [
	postcssImport({
		plugins: [postcssUrl({url: postcssRebase})]
	}),
	postcssUrl({
		url: postcssRebase
	}),
	postcssFlexBugs,
	autoprefixer()
];

const nanoPlugin = cssnano({
	preset: ['default', {
		discardComments: {
			removeAll: true
		}
	}]
});

module.exports = function(input, data, output, opts) {
	const plugins = defaultPlugins.slice();
	const root = postcss.parse(data, {
		from: input,
		map: false
	});

	if (opts.minify !== false) {
		plugins.push(nanoPlugin);
	}
	plugins.push(reporter);
	return postcss(plugins).process(root, {
		from: output,
		to: output,
		map: false
	}).then(result => {
		return {
			data: result.css.replace(/\/\*#\ssourceMappingURL=.+\s\*\//gm, "")
		};
	});
};

function postcssRebase(asset) {
	if (!asset.pathname) return;
	return asset.relativePath + (asset.search || '');
}

