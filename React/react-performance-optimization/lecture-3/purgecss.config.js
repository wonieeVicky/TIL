module.exports = {
  defaultExtractor: (content) => content.match(/[\w:-]+/g) || [], // \w : 0-9a-zA-Z_
}
