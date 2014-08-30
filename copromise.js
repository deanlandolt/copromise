// Core coroutine runner
function run(coroutine) {
	return new Promise(function (resolve, reject) {
		(function next(value, exception) {
			var result;
			try {
				result = exception ? coroutine.throw(value) : coroutine.next(value);
			}
			catch (error) {
				return reject(error);
			}
			if (result.done) return resolve(result.value);
			Promise.resolve(result.value).then(next, function(error) {
				next(error, true);
			});
		})();
	});
}

function isGeneratorFunction(obj) {
	return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

// Throw error in next event turn
function raise(error) {
	if (!error) return;
	setImmediate(function() {
		throw error;
	});
}

// Run coroutine and raise exception on failure
function copromise(coroutine) {
	if (isGeneratorFunction(coroutine)) {
		coroutine = coroutine();
	}
	return run(coroutine).catch(copromise.raise);
}

copromise.exec = function exec(coroutine) {
	return run(coroutine).catch(copromise.raise);
};

module.exports = copromise;
