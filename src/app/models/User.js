const Base = require('../models/Base')
const db = require('../../config/db')

Base.init({table: 'users'})

module.exports = {
    ...Base
}