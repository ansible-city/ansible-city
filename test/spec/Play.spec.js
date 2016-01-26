'use strict';

var assert = require('assert');
var Play = require('../../src/Play.js');
var Role = require('../../src/Role.js');
var play;

describe('Play', function() {
	var playName = 'Test Playbook';

	play = new Play(playName);

	it('should return basic data', function () {
		var data = play.getData();

		assert.equal(playName, data.name);
		assert.equal('all', data.hosts);
	});

	describe('when added a role', function() {
		var role = new Role('./test/roles/role_a');
		play.addRole(role);

		it('should return the role data', function() {
			var data = play.getData();

			assert.equal(playName, data.name);
			assert.equal('role_a', data.roles[0].name);
		});
	});

	describe('when added a list of roles', function() {
		var role = new Role('./test/roles/role_a');
		play.addRoles([ role ]);

		it('should return the role data', function() {
			var data = play.getData();

			assert.equal(playName, data.name);
			assert.equal('role_a', data.roles[0].name);
		});
	});
});
