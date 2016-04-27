'use strict';

var fs = require('fs');
var ph = require('path');
var YAML = require('js-yaml');
var PATH_META = '/meta/main.yml';
var PATH_DEFAULTS = '/defaults/main.yml';
var PATH_TASK = '/tasks/main.yml';
var RoleDumper, roleFiles;

roleFiles = [
	PATH_DEFAULTS,
	PATH_META,
	PATH_TASK
];

RoleDumper = function (role) {
	this.role = role;
};

RoleDumper.prototype.setPath = function (path) {
	this.path = path;
};

RoleDumper.prototype.plan = function (cb) {
	var plan;

	plan = function (err, filesAccess) {
		if (err) {
			return cb(err, null);
		}

		var thePlan = filesAccess.map( a => {
			if ('ENOENT' === a.code) {
				return {
					path: a.path,
					action: 'CREATE'
				};
			}
		});

		return cb(null, thePlan);
	};

	this.access(plan);
};

RoleDumper.prototype.execute = function (cb) {
	var roleDumper = this;

	this.plan( (err, plan) => {
		if (err) {
			return cb(err, null);
		}

		Promise.all(
			plan.map( s => {
				if (roleDumper.path + PATH_TASK === s.path) {
					return Promise.resolve(null);
				}
				if (roleDumper.path + PATH_DEFAULTS === s.path) {
					return Promise.resolve(null);
				}
				if (roleDumper.path + PATH_META === s.path) {
					return new Promise( (res, rej) => {
						roleDumper.dumpMeta( (err, data) => {
							if (err) {
								return rej(err);
							}

							return res(data);
						});
					});
				}
			})
		).then(
			results => {
				cb(null, results);
			},
			err => {
				cb(err, null);
			}
		);
	});
};

RoleDumper.prototype.dumpMeta = function (cb) {
	var roleDumper = this;

	this.role.getMetaData( d => {
		fs.mkdirSync(roleDumper.path);
		fs.mkdirSync(ph.dirname(roleDumper.path + PATH_META));
		fs.writeFile(
			roleDumper.path + PATH_META,
			"---\n" + YAML.safeDump(d),
			err => {
				if (err) {
					return cb(err, null);
				}
				cb(null, { path: roleDumper.path + PATH_META });
			}
		);
	});
};

RoleDumper.prototype.access = function (cb) {
	var roleDumper = this;

	Promise.all(
		roleFiles.map( f => new Promise(
			resolve => {
				fs.access(roleDumper.path + f, fs.W_OK, e => {
					resolve(e);
				});
			}
		) )
	).then(
		res => {
			return cb(null, res.reduce(function (item, prevItem) {
				return item.concat(prevItem);
			}, [ ]));
		},
		err => cb(err, null)
	);
};

module.exports = RoleDumper;
