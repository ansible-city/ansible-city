'use strict';

//var assert = require('assert');
var assert = require('chai').assert
var expect = require('chai').expect
var Role = require('../../src/Role.js');
var ROLE_NAME = 'role_a';
var rolePath, notRolePath, RoleNoDefaultsPath;

describe('Role ', function() {
	rolePath = './test/roles/role_a';
	RoleNoDefaultsPath = './test/roles/role_no_defaults';
	notRolePath = './test/roles/not-role';

	it('should validate role folder', function () {
		var role = new Role(notRolePath);
		assert.equal(false, role.isRole());

		role = new Role(rolePath);
		assert.equal(true, role.isRole());
	});

	describe('when no defaults/main.yml is present', function () {
		var role = new Role(RoleNoDefaultsPath);

		it('shold return empty defaults', function (done) {
			var cb = function(defaults) {
				expect(defaults).to.be.instanceof(Object);
				expect(defaults).to.be.empty;
				done();
			}

			role.getDefaults(done, cb);
		})
	});

	it('should get default variables', function (done) {
		var role = new Role(rolePath);
		var cb = function(defaults) {
			expect(defaults).to.be.instanceof(Object);
			expect(defaults.role_a).to.be.instanceof(Object);
			expect(defaults.role_a.version).to.be.equal(1);
			done();
		}

		role.getDefaults(done, cb);
	});

	it('should get meta inforamtion', function (done) {
		var role = new Role(rolePath);
		var meta, cb;

		cb = function (meta) {
			expect(meta).to.instanceof(Object);
			expect(meta.dependencies).to.instanceof(Array);
			done();
		}

		meta = role.getMeta(done, cb);
	});

	describe('when included in Play', function () {
		var role = new Role(rolePath);
		var rolePlayData = role.getPlayData();

		it('should not contain role vars by default', function () {
			expect(rolePlayData).to.be.instanceof(Object);
			expect(rolePlayData).to.have.property('name', ROLE_NAME);
			expect(rolePlayData).not.to.have.property(ROLE_NAME);
		});

		it('should not contain role vars by default', function () {
			expect(rolePlayData).to.be.instanceof(Object);
			expect(rolePlayData).to.have.property('name', ROLE_NAME);
			expect(rolePlayData).not.to.have.property(ROLE_NAME);
		});
	})
});
