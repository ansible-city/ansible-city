'use strict';

var fs = require('fs');
var ph = require('path');
var YAML = require('js-yaml');
var Playbook;

Playbook = function (play) {
	this.plays = [play];
};

Playbook.prototype.getData = function() {
	return this.plays.map( p => p.getData());
}

module.exports = Playbook;
