'use strict';

var assert = require('assert');
var RoleList = require('../../src/role-list.js');
var list, cb;

describe('Role List', function() {
	list = new RoleList();

	it('should list roles from directory', function (done) {
		cb = function(roles) {
			assert.equal('role_a', roles[0].name);
			done();
		}
		list.scanFolders(done, cb, [ './test/roles' ]);
	});
});
