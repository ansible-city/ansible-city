'use strict';

var assert = require('assert');
var Play = require('../../src/Play.js');
var Playbook = require('../../src/Playbook.js');
var play, playbook;

describe('Playbook', function() {
	var playName = 'Test Playbook';

	play = new Play(playName);
	playbook = new Playbook(play);

	it('should contain single play by default', function () {
		var data = playbook.getData();

		assert.equal(1, data.length);
	});
});
