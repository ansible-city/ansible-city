'use strict';

var fs = require('fs');
var ph = require('path');
var YAML = require('js-yaml');
var PATH_META = '/meta/main.yml'
var PATH_DEFAULTS = '/defaults/main.yml'
var Role;

Role = function (path) {
	this._path = path;
	this.name = ph.basename(path);
	this.defaults = {};
	this.meta = {};
};

Role.prototype.isRole = function() {
	try {
		fs.accessSync(this._path + '/tasks/main.yml', fs.R_OK);
		fs.accessSync(this._path + PATH_META, fs.R_OK);
	} catch (e) {
		return false;
	}

	return true;
};

Role.prototype.getRoleData = function() {
	var data = {
		name: this.name,
	};

	data[this.name] = this.defaults[this.name];
	return data;
};

Role.prototype.getPlayData = function() {
	var data = {
		name: this.name,
	};

	return data;
};

Role.prototype.getDefaults = function(err, cb) {
	var role = this;

	fs.readFile(this._path + PATH_DEFAULTS, (readErr, content) => {
		if (readErr) cb({ });

		role.defaults = YAML.safeLoad(content.toString());
		cb(role.defaults);
	});
};

Role.prototype.getMeta = function(err, cb) {
	var role = this;

	fs.readFile(this._path + PATH_META, (readErr, content) => {
		if (readErr) err(readErr);

		role.meta = YAML.safeLoad(content.toString());
		cb(role.meta);
	});
}

module.exports = Role;
