'use strict';

var RoleList = require('./src/role-list.js')
var Play = require('./src/Play.js')
var Playbook = require('./src/Playbook.js')
var config = require('./config.json');
var YAML = require('js-yaml');
var list = new RoleList();

var cb = function(roles) {
	var play, playbook, tpl;

	roles = roles.filter(function (role) {
		var keep = false;
		process.argv.forEach( r => { if (r == role.name) keep = true; });

		return keep;
	});

	play = new Play('Example Playbook');
	play.addRoles(roles);
	playbook = new Playbook(play);

	console.log(YAML.safeDump(playbook.getData()));
}

process.argv.splice(0,2);

list.scanFolders(null, cb, config.ansible.roles);
