# slow-kill

Tries to kill a process nicely and after a timeout invokes kill(9).

```js
const { spawn } = require('child_process')
const TIMEOUT = 500

const proc = spawn(process.execPath, [ require.resolve('some-script') ])
await slowKill(proc, TIMEOUT)
```

## Installation

    npm install slow-kill

## [API](https://thlorenz.github.io/slow-kill)


## License

MIT
