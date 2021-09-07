const Cache = require('postinstall-cache');

const cacheWorker = Cache.worker({
	dirname: __dirname
});

module.exports = function (inputs, output, options) {
	return cacheWorker(inputs, output, options);
};

