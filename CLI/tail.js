const fs = require('fs')

let fileName = process.argv[2] || 'test.txt'
let N = parseInt(process.argv[3]) || 10

const tail = (fileName, N) => {
  let lines = fs.readFileSync(fileName, 'utf-8').split('\n')
  N = Math.min(N, lines.length - 1)
  for (let i = lines.length - N; i < lines.length; i++) {
    console.log(lines[i])
  }
}

tail(fileName, N)

let bool = false
fs.watch(fileName, (e, file) => {
  if (bool) {
    console.log('\x1b[32m%s\x1b[0m', 'Change Detected')
    tail(file, N)
    bool = false
  } else bool = true
})
