'use strict';

var fs = require('fs');
var Role = require('./role');
var RoleList, isRole;

RoleList = function () {};

isRole = function(path) {
	var role = new Role(path);

	return role.isRole();
}

RoleList.prototype.scanFolders = function(err, cb, folders) {
	var scanFolder, promises;

	scanFolder = function(err, cb, folder) {
		fs.readdir(folder, function (readdirErr, files) {
			var roles;

			if (readdirErr) {
				err(readdirErr);
			}

			roles = files.map( i => new Role(folder + '/' + i) );
			roles = roles.filter( r => r.isRole() );

			cb(roles);
		});
	};

	promises = folders.map(function (folder) {
		return new Promise(function (resolve, reject) {
			scanFolder(reject, resolve, folder);
		});
	});

	Promise.all(promises).then(function (res) {
		cb(res.reduce(function (item, prevItem) {
			return item.concat(prevItem);
		}, [ ]));
	});
};

RoleList.prototype.getFromList = function(err, cb, rolesList, roleName) {
	return rolesList.filter(function (role) {
		return role.name == roleName
	});
};

module.exports = RoleList
