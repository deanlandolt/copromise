var assert = require('assert')
var Copromise = require('../')

// TODO: assert some shit
//
// for now this is just a dummy script to exercise functionality
//
function sleep(delay) {
	return new Promise(function (resolve) {
		setTimeout(function () {
			resolve()
		}, delay)
	})
}

function fail(delay) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			reject(new Error('BOOM'))
		}, delay)
	})
}

function echo(value) {
	return sleep(10).then(function () {
		return value
	})
}

function multiply(value) {
	return Promise.all([ echo(value), echo(value) ]).then(function (values) {
		return values.join(', ')
	})
}

function* coroutine(value, fail) {
	console.log(value)
	yield sleep(1000)
	if (fail)
		throw new Error(fail)

	return yield multiply(value)
}

// Async function wrapper

var fn = Copromise(coroutine)

fn('hello').then(function (value) {
	console.log('received:', value)
})

fn('...', 'fail').then(function () {
	console.log('wtf')
}, function (e) {
	console.log('FAIL:', e)
})

// Program runner
Copromise.run(function* () {
	console.log('a')

	yield sleep(500)

	console.log('b')

	console.log(yield multiply('eh'))

	console.log(yield* coroutine('meh'))

	yield sleep(100)

	console.log('c')

	try {
		var f = yield fail(100)
	}
	catch (e) {
		console.log('FAIL:', e)
	}

	try {
		console.log(yield* coroutine('meh', 'delegated fail'))
	}
	catch (e) {
		console.log('FAIL:', e)
	}

	// var f = yield fail(100)

	console.log(yield echo('foo'))
})
