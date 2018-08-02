'use strict'

process
  .on('SIGTERM', () => {})
  .on('SIGHUP', () => {})
  .on('SIGINT', () => {})
console.error({ pid: process.pid })
setInterval(() => process.stdout.write('.'), 1000)
