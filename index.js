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
const {
  upsertPhoto,
  removePhoto,
} = require('./lib/algolia.js')

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
  const deleted = req.body.sys.type === 'DeletedEntry'

  if (deleted) {
    return removePhoto(req.body.sys.id)
      .then(id => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          status: 200,
          action: 'removePhoto',
          id
        }))
        res.end()
      })
      .catch(e => {
        console.error(
          chalk.red('/algolia removePhoto'),
          e
        )
        res.writeHead(500, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          status: 500,
          message: '/algolia upsertPhoto'
        }))
        res.end()
      })
  }

  const contentType = getContentType(req.body)

  if (contentType === 'photo') {
    return upsertPhoto(formatPhotoForAlgolia(req.body))
      .then(photo => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          status: 200,
          action: 'upsertPhoto',
          photo
        }))
        res.end()
      }).catch(e => {
        console.error(
          chalk.red('/algolia upsertPhoto'),
          e
        )
        res.writeHead(500, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          status: 500,
          message: '/algolia upsertPhoto'
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
