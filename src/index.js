'use strict'

const fs         = require('fs')
const async      = require('async')
const browserify = require('./browserify')
const uglifyjs   = require('./uglifyjs')

/*
 * Load, transform, bundle and compress JS.
 * @public
 * @param {string} filePath - Absolute path to the requested file.
 * @param {string} srcPath - Absolute path to the source folder.
 * @param {string} distPath - Absolute path to the export folder.
 * @param {Object} route - The route which matched the request URL.
 * @param {function} next - The callback that handles the response. Receives the following properties: err, result, savePath.
 */
module.exports = function(filePath, srcPath, distPath, route, next) {

	const savePath = filePath.replace(srcPath, distPath)

	const optimize = (distPath==null ? false : true)
	const opts     = { optimize }

	async.waterfall([

		(next)      => browserify(filePath, opts, next),
		(str, next) => uglifyjs(str, opts, next)

	], (err, str) => {

		if (err!=null) {
			next(err, null, null)
			return false
		}

		next(null, str, savePath)

	})

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 */
module.exports.cache = [
	'.js',
	'.json'
]