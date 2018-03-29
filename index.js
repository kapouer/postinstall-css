const postcss = require('postcss');
const postcssUrl = require("postcss-url");
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring');
const reporter = require('postcss-reporter');

const pify = require('util').promisify;
const fs = require('fs');
const readFile = pify(fs.readFile);
const writeFile = pify(fs.writeFile);

const processor = postcss([
	postcssImport({
		plugins: [postcssUrl({url: postcssRebase})]
	}),
	postcssUrl({url: postcssRebase}),
	autoprefixer(),
	reporter(),
	csswring({
		preserveHacks: true,
		removeAllComments: true
	})
]);

module.exports = function(inputs, output, options) {
	if (inputs.length == 0) return writeFile(output, "");
	return Promise.all(inputs.map(function(input) {
		return readFile(input);
	})).then(function(files) {
		var root = postcss.root();
		files.forEach(function(file, i) {
			var cur = postcss.parse(file, {
				from: inputs[i],
				map: {
					inline: false
				}
			});
			root.append(cur);
		});
		return processor.process(root, {
			from: output,
			to: output,
			map: {
				inline: false
			}
		});
	}).then(function(result) {
		var list = [writeFile(output, result.css)];
		if (result.map) list.push(writeFile(`${output}.map`, result.map));
		return Promise.all(list);
	});
};

function postcssRebase(asset, dir, opts, ast, warn, result) {
	var path = asset.pathname;
	var to = result.opts.to;
	if (!path) return;
	return asset.relativePath;
}

