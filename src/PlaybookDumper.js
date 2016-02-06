'use strict';

var fs = require('fs');
var YAML = require('js-yaml');
var PlaybookDumper;

PlaybookDumper = function (playbook) {
	this.playbook = playbook;
};

PlaybookDumper.prototype.setPath = function (path) {
	this.path = path;
};

PlaybookDumper.prototype.plan = function (cb) {
	var plan;

	plan = function (err, filesAccess) {
		var thePlan;

		if (err) {
			cb(err, null);
		}

		thePlan = filesAccess.map( a => {
			if ('ENOENT' === a.code) {
				return {
					path: a.path,
					action: 'CREATE'
				};
			}
			if ('EXISTS' === a.code) {
				return {
					path: a.path,
					action: 'UPDATE'
				};
			}
		});

		return cb(null, thePlan);
	};

	this.access(plan);
};

PlaybookDumper.prototype.execute = function (cb) {
	var playbookDumper = this;

	this.plan( (err, plan) => {
		fs.writeFileSync(
			plan[0].path,
			"---\n" + YAML.safeDump(playbookDumper.playbook.getData())
		);
		cb( null, [ {
			path: plan[0].path
		} ] );
	});
};

PlaybookDumper.prototype.access = function (cb) {
	var PlaybookDumper = this;

	new Promise( resolve => {
		fs.stat(PlaybookDumper.path, e => {
			if (e) {
				return resolve({
					code: e.code,
					path: PlaybookDumper.path
				});
			}
			resolve({
				code: 'EXISTS',
				path: PlaybookDumper.path
			});
		});
	}).then(
		res => cb(null, [ res ]),
		err => cb(err, null)
	);
};

module.exports = PlaybookDumper;
