const postcss = require('postcss');
const postcssUrl = require("postcss-url");
const postcssImport = require('postcss-import');
const postcssFlexBugs = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring');
const reporter = require('postcss-reporter');

const pify = require('util').promisify;
const fs = {
	readFile: pify(require('fs').readFile),
	writeFile: pify(require('fs').writeFile)
};

module.exports = function(inputs, output, options) {
	if (inputs.length == 0) return Promise.resolve();
	return Promise.all(inputs.map(function(input) {
		return fs.readFile(input);
	})).then(function(files) {
		const root = postcss.root();
		files.forEach(function(file, i) {
			var cur = postcss.parse(file, {
				from: inputs[i],
				map: {
					inline: false
				}
			});
			root.append(cur);
		});

		const plugins = [
			postcssImport({
				plugins: [postcssUrl({url: postcssRebase})]
			}),
			postcssUrl({
				url: postcssRebase
			}),
			postcssFlexBugs,
			autoprefixer({
				browsers: options.browsers || [ ">=0.15%, not ie 8" ]
			})
		];

		if (options.minify !== false) {
			plugins.push(csswring({
				preserveHacks: true,
				removeAllComments: true
			}));
		}
		plugins.push(reporter);
		return postcss(plugins).process(root, {
			from: output,
			to: output,
			map: {
				inline: false
			}
		});
	}).then(function(result) {
		const list = [fs.writeFile(output, result.css)];
		if (result.map) list.push(fs.writeFile(`${output}.map`, result.map));
		return Promise.all(list);
	});
};

function postcssRebase(asset) {
	if (!asset.pathname) return;
	return asset.relativePath;
}

