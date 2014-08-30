

A `copromise` represents the eventual value of a coroutine. A coroutine is a generator function where the `yield` keyword is used to suspend execution to wait on a future value, allowing linear control flow logic for asynchronous code.

## `yield`

Any kind of value can be yielded, either a promise or non-promise value. In other words, `yield` is very much like the `when` method exposed by some popular promise libraries. Internally, every yielded value is wrapped with `Promise.resolve`, and when this promise is fulfilled its value will be returned as the result of the `yield` expression. If an exeption is thrown or this promise is rejected the `yield` expression will throw in the coroutine, which can be caught with the standard `try`/`catch` syntax.


## `return`

Running a coroutine returns a promise which will resolve to the return value of the coroutine, if any. An unhandled exeption in the coroutine will result in a rejected promise.


## `yield*`

The `yield*` operator can be used to invoke to another coroutine. The result of the yield* epxression (if successful) will be the value returned from the delegated coroutine. If this value is a promise it will be resolved before execution resumes in the originating coroutine.
