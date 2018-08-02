'use strict'

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time).unref()
  })
}

class SlowKiller {
  constructor(proc, wait) {
    this._proc = proc
    this._termination = new Promise(resolve => {
      this._proc.once('exit', code => {
        this._exited = true
        resolve(code)
      })
    })
    this._wait = wait
    this._exited = false
    this.forcedExit = false
  }

  async kill() {
    process.kill(this._proc.pid, 'SIGTERM')
    await Promise.race([ sleep(this._wait), this._termination ])
    if (!this._exited) process.kill(this._proc.pid, 9)
  }
}

/**
 * Tries to kill a process nicely (via SIGTERM) and forcefully kills it if it didn't exit
 * after a given timeout.
 *
 * @name slowKill
 *
 * @param {Object} proc the node process to kill
 * @param {Number} [wait=500] time to wait before invoking `kill(9)` if process doesn't exit
 * @returns {Promise} a promise that resolves once the process exited
 */
async function slowKill(proc, wait = 500) {
  return new SlowKiller(proc, wait).kill()
}

module.exports = slowKill
