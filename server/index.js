'use strict'

var NAMESPACE = '@rill/rate-limit'
var Cache = require('keyv')
var ms = require('ms')
var MS_FORMAT = { long: true }

/*
 * Expose middleware that will rate limit requests based on IP.
 * Cacheman used to abstract database usage.
 */
module.exports = function rateLimit (opts) {
  opts = opts || {}
  opts.cache = opts.cache || {}
  opts.cache.namespace = opts.key || NAMESPACE
  var max = opts.max || 2500
  var duration = opts.duration || 3.6e+6 // Default to 1hr.
  var cache = new Cache(opts.cache)
  var headers = opts.headers || {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  }

  // Allow for '1 minute' style duration.
  if (typeof duration === 'string') duration = ms(duration)
  // Ensure proper duration.
  if (typeof duration !== 'number') throw new TypeError('Rate limit duration must be a string or number.')

  return function rateLimitMiddleware (ctx, next) {
    var address = opts.id ? opts.id(ctx) : ctx.req.ip
    var now = Date.now()
    var res = ctx.res

    // Grab rate limit info from cache.
    return cache.get(address).then(function (result) {
      if (!result) {
        result = { remaining: max, resets: now + duration }
      } else if (result.resets < now) {
        result.remaining = max
        result.resets = now + duration
      }

      var hadRemaining = result.remaining > 0
      if (hadRemaining) result.remaining--

      // Set rate limit headers.
      res.set(headers.remaining, result.remaining)
      res.set(headers.reset, result.resets)
      res.set(headers.total, max)

      // Save attempt if they have remaining trys.
      if (hadRemaining) {
        return Promise.all([
          cache.set(address, result),
          next()
        ])
      }

      // Otherwise we stop the request.
      var delta = result.resets - Date.now()
      res.set('Retry-After', delta)
      res.status = 429
      res.message = 'Rate limit exceeded, retry in ' + ms(delta, MS_FORMAT) + '.'
    })
  }
}
