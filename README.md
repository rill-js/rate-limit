<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/rate-limit
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/rate-limit">
    <img src="https://img.shields.io/npm/v/@rill/rate-limit.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/rate-limit">
    <img src="https://img.shields.io/npm/dm/@rill/rate-limit.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Rate limit middleware for Rill.

Uses [Keyv](https://github.com/lukechilds/keyv) for persistance. Supports caching in memory, mongodb, redis, sqllite, mysql and postgre.

# Installation

```console
npm install @rill/rate-limit
```

# Example

#### app.js

```js
const app = rill()
const limit = require("@rill/rate-limit")

// Setup the middleware. (1000 req/hr max)
app.use(limit({
  max: 1000,
  duration: '1 hour'
}))
```

# Options

```js
{
  /**
   * Key used for keyv namespace.
   */
  key: '@rill/rate-limit',
  /**
   * The maximum amount of requests from a user per period.
   */
  max: 2500,
  /**
   * The duration of a period. (in ms or as a string).
   */
  duration: '1 hour',
  /**
   * Overrride the identifier for the users (default is their ip addresss).
   */
  id: ctx => ctx.req.ip,
  /**
   * Passed to keyv, do not send this to client.
   * Mongo db example. (must have installed keyv-mongo).
   */
  cache: !process.brower && {
    uri: 'mongodb://user:pass@localhost:27017/dbname' // Default is in memory (see keyv uri).
  }
}
```

---

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
