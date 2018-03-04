function getLocale (obj) {
  return obj['en-US'] ? obj['en-US'] : obj
}

/**
 * These are the fields we want to search by,
 * and the fields we need returned on search in
 * order to fetch the data we need for our view.
 *
 * For example, we aren't searching for photographers
 * at the moment, but if we have the photographer's ID,
 * we can fetch their info when the search resolves.
 *
 * objectID - Algolia wants this field named
 */
function formatPhotoForAlgolia ({ sys, fields }) {
  const allowedFields = [
    'title',
    'description',
    'tags'
  ]
  return Object.keys(fields).reduce((obj, k) => {
    if (allowedFields.indexOf(k) > -1) {
      obj[k] = getLocale(fields[k])
    }
    return obj
  }, {
    objectID: sys.id,
    photographer: fields.photographer ? getLocale(fields.photographer).sys.id : null
  })
}

function getContentType (body) {
  return body.sys.contentType.sys.id
}

module.exports = {
  formatPhotoForAlgolia,
  getContentType,
  getLocale
}
