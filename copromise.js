// Core coroutine runner
function spawn(coroutine) {
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

// Create an async function from provided coroutine (generator factory)
function copromise(coroutine) {
	return function fn() {
		return spawn(coroutine.apply(this, arguments));
	}
}

// Rethrow error in next event turn
function raise(error) {
	if (!error) return;
	setImmediate(function() {
		throw error;
	});
}

// Run coroutine and raise exception on failure
copromise.run = function run(coroutine) {
	return spawn(coroutine()).catch(raise);
};

module.exports = copromise;
