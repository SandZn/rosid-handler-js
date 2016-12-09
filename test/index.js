'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

let validFile   = null
let invalidFile = null

describe('index()', function() {

	before(function() {

		validFile = temp.openSync({
			dir    : __dirname,
			suffix : '.js'
		})

		fs.writeFileSync(validFile.path, `const fn = () => {}`)

		invalidFile = temp.openSync({
			dir    : __dirname,
			suffix : '.js'
		})

		fs.writeFileSync(invalidFile.path, `=`)

	})

	it('should return an error when called with a invalid filePath', function() {

		return index(null, '/src', '/dist', {}).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.js', '/src', '/dist', {}).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when called with an invalid JS file and everything else specified', function() {

		return index(invalidFile.path, '/src', '/dist', {}).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should load JS and transform it to JS when everything specified', function() {

		return index(validFile.path, '/src', '/dist', {}).then(({ data, savePath }) => {

			assert.isString(data)
			assert.isString(savePath)
			assert.strictEqual(savePath.substr(-3), '.js')

		})

	})

	it('should load JS and transform it to JS when distPath not specified', function() {

		return index(validFile.path, '/src', null, {}).then(({ data, savePath }) => {

			assert.isString(data)
			assert.isString(savePath)
			assert.strictEqual(savePath.substr(-3), '.js')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})