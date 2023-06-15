const appRoot = require('app-root-path').toString();
const config = require('config-node');
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `${appRoot}/.env.${env}` });

let defaults = config({ env: 'default', dir: __dirname });

try {
	module.exports = config({
		env: process.env.NODE_ENV || 'development',
		dir: __dirname
	});
} catch (err) {
	module.exports = defaults;
}
