const client = require('algoliasearch')(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_TOKEN
)

const index = client.initIndex('photos')

module.exports = {
  upsertPhoto (photo) {
    return new Promise((resolve, reject) => {
      index.partialUpdateObject(
        photo,
        (err, content) => {
          if (err) reject(err)
          resolve(photo)
        }
      )
    })
  },
  removePhoto (id) {
    return new Promise((resolve, reject) => {
      index.deleteObject(
        id,
        err => {
          if (err) reject(err)
          resolve(id)
        }
      )
    })
  }
}
