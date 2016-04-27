'use strict';

var Playbook;

Playbook = function (play) {
	this.plays = [play];
};

Playbook.prototype.getData = function () {
	return this.plays.map( p => p.getData());
};

module.exports = Playbook;
