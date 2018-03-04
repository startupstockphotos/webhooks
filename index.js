require('now-env')

const debug = require('debug')('index')
const server = require('connect')()
const router = require('router')()
const cors = require('cors')
const parser = require('body-parser')
const helmet = require('helmet')
const chalk = require('chalk')
const {
  formatPhotoForAlgolia,
  getContentType
} = require('./lib/util.js')
const { upsertPhoto } = require('./lib/algolia.js')

const PORT = process.env.PORT || 3002

server.use(helmet())
server.use(cors())
server.use(parser.json())

router.post('/algolia', parser.json({
  type: [
    'application/json',
    'application/vnd.contentful.management.v1+json'
  ]
}), (req, res) => {
  const type = getContentType(req.body)
  if (type === 'photo') {
    upsertPhoto(formatPhotoForAlgolia(req.body))
      .then(photo => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify(photo))
        res.end()
      }).catch(e => {
        console.error(
          chalk.red('/photos'),
          e
        )
        res.writeHead(500, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          status: 500,
          message: '/photos failed'
        }))
        res.end()
      })
  }
})

router.get('*', (req, res) => {
  res.writeHead(404, {
    'Content-Type': 'text/html'
  })
  res.write('Nothing to see here!')
  res.end()
})

server.use(router)

server.listen(PORT, () => `Server running on port ${PORT}`)
