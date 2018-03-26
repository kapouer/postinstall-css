var postcss = require('postcss');
var postcssUrl = require("postcss-url");
var postcssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var reporter = require('postcss-reporter');

var pify = require('util').promisify;
var fs = require('fs');
fs = {
	readFile: pify(fs.readFile),
	writeFile: pify(fs.writeFile)
};

module.exports = function(input, output, options) {
	var plugins = [
		postcssImport({
			plugins: [postcssUrl({url: postcssRebase})]
		}),
		postcssUrl({url: postcssRebase}),
		autoprefixer(),
		reporter(),
		csswring({
			preserveHacks: true
		})
	];
	return fs.readFile(input).then(function(data) {
		return postcss(plugins).process(data, {
			from: input,
			to: output,
			map: {
				inline: false
			}
		}).then(function(result) {
			var list = [fs.writeFile(output, result.css)];
			if (result.map) list.push(fs.writeFile(`${output}.map`, result.map));
			return Promise.all(list);
		});
	});
};

function postcssRebase(oldUrl, decl, from, dirname, to, options, result) {
	var urlObj = URL.parse(oldUrl);
	if (urlObj.protocol) return oldUrl;
	var newPath = oldUrl;
	if (dirname !== from) {
		newPath = Path.relative(from, Path.join(dirname, newPath));
	}
	newPath = Path.resolve(from, newPath);
	newPath = Path.relative(to, newPath);
	return '/' + newPath;
}
