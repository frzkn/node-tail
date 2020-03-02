
const express = require('express')
const app = express()
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.static('public'))

const fileName = 'test.txt'
let N = 10

let dataArr = []

app.get('/', (req, res) => {
	res.render('index')
})

const server = app.listen(3001)

const io = require('socket.io')(server)

  const getTime = () => {
    let d = new Date()
    return d.toLocaleTimeString()
  }


io.on('connection', (socket) => {
  console.log('New Connection')

  let lines = fs.readFileSync(fileName, 'utf-8').split('\n')
  N = Math.min(N, lines.length - 1)
  dataArr = []
  for (let i = lines.length - N; i < lines.length; i++) {
    // console.log(lines[i])
    dataArr.push(lines[i])
  }
  io.sockets.emit('tail', {
    data: dataArr,
    time: getTime()
  })

  fs.watch(fileName, (e, file) => {
    setTimeout(() => {
      let lines = fs.readFileSync(fileName, 'utf-8').split('\n')
      N = Math.min(N, lines.length - 1)
      dataArr = []
      for (let i = lines.length - N; i < lines.length; i++) {
        dataArr.push(lines[i])
      }
      io.sockets.emit('tail', {
        data: dataArr,
        time: getTime()
      })
    }, 500)
  })
})
