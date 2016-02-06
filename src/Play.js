'use strict';

var Play;

Play = function (name) {
	this.name = name;
	this.hosts = 'all';
	this.roles = [];
};

Play.prototype.getData = function () {
	var yaml = {
		name: this.name,
		hosts: this.hosts,
		vars: [],
		vars_files: [],
		pre_tasks: [],
		roles: this.roles.map( r => r.getPlayData() ),
		tasks: [],
		post_tasks: []
	};

	return yaml;
};

Play.prototype.addRole = function (role) {
	this.roles.push(role);
};

Play.prototype.addRoles = function (roles) {
	roles.forEach( r => this.addRole(r) );
};

module.exports = Play;
