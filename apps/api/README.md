# Api

Since this project will be archived in the future, there is a controller to bypass API logic to go directly in store (take care of authentication).

To do the bypass, use this controller: `passThroughController`, like this:

```js
router.get('/2fa/setup', passThroughController)
```
