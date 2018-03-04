const client = require('contentful').createClient({
  space: process.env.CONTENTFUL_ID,
  accessToken: process.env.CONTENTFUL_TOKEN
})

module.exports = {
  client,
  getPhoto (id) {
    return client.getEntry(id)
  }
}
