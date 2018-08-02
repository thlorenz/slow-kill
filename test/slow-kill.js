'use strict'

const test = require('tape')

const slowKill = require('../')
const { spawn } = require('child_process')
const TIMEOUT = 500
const { promisify } = require('util')
const sleep = promisify(setTimeout)

const now = require('performance-now')

test('\nkilling cooperative process', async function(t) {
  const start = now()
  const proc = spawn(process.execPath, [ require.resolve('./fixtures/cooperative') ])
  let exited = false
  proc.once('exit', () => (exited = true))
  await slowKill(proc, TIMEOUT)
  const end = now()

  t.ok(exited, 'process exited voluntarily')
  t.ok(end - start < TIMEOUT, 'did not wait for timeout')

  t.end()
})

test('\nkilling uncooperative process', async function(t) {
  const start = now()
  const proc = spawn(process.execPath, [ require.resolve('./fixtures/uncooperative') ])
  let exited = false
  proc.once('exit', () => (exited = true))
  // Give process a chance to override signal handlers
  await sleep(100)
  await slowKill(proc, TIMEOUT)
  const end = now()

  t.ok(!exited, 'process did not exit voluntarily')
  t.ok(end - start >= TIMEOUT, 'did wait for timeout')
  t.end()
})
