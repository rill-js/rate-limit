'use strict'

var test = require('tape')
var agent = require('supertest').agent
var rill = require('rill')
var limit = require('../server')

test('Should rate limit an ip address', function (t) {
  t.plan(1)

  var request = agent(rill()
    .use(limit({ max: 2, duration: 100 }))
    .get('/page', ({ res }) => { res.status = 200 })
    .listen().unref())

  // Request too page quickly.
  Promise.all([
    request.get('/page?1').expect(200),
    request.get('/page?2').expect(200)
  ]).then(() => {
    // Should fail after two quick requests.
    return Promise.all([
      request.get('/page?3').expect(429),
      request.get('/page?4').expect(429)
    ])
  }).then(() => {
    // Allow timer to reset.
    return new Promise(resolve => setTimeout(resolve, 200))
  }).then(() => {
    return Promise.all([
      request.get('/page?5').expect(200),
      request.get('/page?6').expect(200)
    ])
  }).then(() => {
    // Should fail after two quick requests.
    return Promise.all([
      request.get('/page?7').expect(429),
      request.get('/page?8').expect(429)
    ])
  }).then(() => {
    t.pass('Success')
  }).catch(t.fail)
})
