const DotEnv = require('dotenv')
const env = DotEnv.config().parsed
if (!env) throw new Error('Please make sure you have a .env file in the project directory')

module.exports = () => Object.keys(env).reduce((last, current) => {
  last[current] = JSON.stringify(env[current])
  return last
}, {})
