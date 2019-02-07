module.exports = {
  coverageDirectory: `./.coverage/`,
  collectCoverage: true,
  transform: {
    "^.+\\.js$": `babel-jest`
  },
  verbose: true
}
