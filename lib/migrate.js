require('now-env')

const { client } = require('./contentful.js')
const {
  formatPhotoForAlgolia,
  getContentType
} = require('./util.js')
const { upsertPhoto } = require('./algolia.js')

client.getEntries({
  content_type: 'photo'
}).then(({ items }) => {
  items.forEach(item => {
    upsertPhoto(formatPhotoForAlgolia(item))
  })
})
