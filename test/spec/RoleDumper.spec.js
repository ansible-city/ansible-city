'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var RoleDumper = require('../../src/RoleDumper.js');
var Role = require('../../src/Role.js');

function deleteRoleFolder(rolePath) {
	try {
		fs.unlinkSync(rolePath + '/meta/main.yml');
		fs.rmdirSync(rolePath + '/meta');
		fs.rmdirSync(rolePath);
	} catch(e) {
		// om nom nom
	}
}

describe('RoleDumper ', function() {
	var rolePath, notRolePath, RoleNoDefaultsPath, role, roleDumper;

	rolePath = './test/roles/role_a';
	RoleNoDefaultsPath = './test/roles/role_no_defaults';
	notRolePath = './test/roles/not-role';
	role = new Role(rolePath);

	describe('when asked for a dump plan', function () {

		before(function () {
			roleDumper = new RoleDumper(role);
			roleDumper.setPath('/tmp/test.role');
		});

		it('should present non empty list of files', function(done) {
			var cb;

			cb = function(err, plan) {
				try {
					expect(err).to.be.null;
					expect(plan).not.to.be.empty;
					expect(plan).to.contain({
						action: 'CREATE',
						path: '/tmp/test.role/defaults/main.yml'
					});
					expect(plan).to.contain({
						action: 'CREATE',
						path: '/tmp/test.role/meta/main.yml'
					});
					expect(plan).to.contain({
						action: 'CREATE',
						path: '/tmp/test.role/tasks/main.yml'
					});
				} catch (e) {
					return done(e);
				}

				done();
			};

			roleDumper.plan(cb);
		});
	});

	describe('when executed', function () {
		before(function () {
			roleDumper = new RoleDumper(role);
			roleDumper.setPath('/tmp/test.role');
		});

		after(function () {
			deleteRoleFolder('/tmp/test.role');
		});

		it('should create role files', function(done) {
			roleDumper.execute( (err) => {
				try {
					expect(err).to.be.null;
				} catch (e) {
					return done(e);
				}

				done();
			});
		});
	});

});
