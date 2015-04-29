//
// core coroutine runner
//
function spawn(coroutine) {
	return new copromise.Promise(function (resolve, reject) {
		(function next(value, exception) {
			var result
			try {
				result = exception ? coroutine.throw(value) : coroutine.next(value)
			}
			catch (error) {
				return reject(error)
			}
			if (result.done)
				return resolve(result.value)

			Promise.resolve(result.value).then(next, function(error) {
				next(error, true)
			})
		})()
	})
}

//
// create an async function from provided coroutine (generator factory)
//
function copromise(coroutine) {
	return function () {
		return spawn(coroutine.apply(this, arguments))
	}
}

//
// allow overriding of promise implementation for subclassing
//
copromise.Promise = Promise

//
// rethrow error in next event turn
//
function raise(error) {
	setImmediate(function() {
		throw error
	})
}

//
// run coroutine and raise exception on failure
//
copromise.run = function run(coroutine) {
	return spawn(coroutine()).catch(raise)
}

module.exports = copromise
