#!/usr/bin/env node
const { binGenerator } = require('yp-utils')
const pkg = require('../package.json')
const files = require('../lib')
const { map, keys } = require('./map')

module.exports = binGenerator({
  pkg, files, map, keys
})
