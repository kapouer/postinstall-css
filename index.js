const WorkerNodes = require('worker-nodes');
const Path = require('path');

const worker = new WorkerNodes(Path.join(__dirname, 'worker.js'), {
	taskTimeout: 60 * 1000,
	minWorkers: 1,
	maxWorkers: 1
});

module.exports = function(inputs, output, options) {
	return worker.call(inputs, output, options);
};

