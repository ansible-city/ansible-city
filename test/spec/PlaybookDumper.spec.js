'use strict';

var expect = require('chai').expect;
var fs = require('fs');
var Play = require('../../src/Play.js');
var Playbook = require('../../src/Playbook.js');
var PlaybookDumper = require('../../src/PlaybookDumper.js');
var play, playbook, playbookDumper, playbookPath;

playbookPath = '/tmp/test_playbook.yml';

describe('PlaybookDumper', function() {
	var playName = 'Test PlaybookDumper';

	play = new Play(playName);
	playbook = new Playbook(play);

	describe('when asked for a dump plan', function () {
		before(function () {
			playbookDumper = new PlaybookDumper(playbook);
			playbookDumper.setPath(playbookPath);
		});

		it('should present exactly one file', function (done) {
			var cb;

			cb = function (err, plan) {
				if (err) {
					done(err);
				}

				try {
					expect(plan).to.contain({
						action: 'CREATE',
						path: playbookPath
					});
				} catch(e) {
					return done(e);
				}

				return done();
			};

			playbookDumper.plan(cb);
		});

		describe('when playbook file exisit', function () {
			before(function () {
				fs.writeFileSync(playbookPath, "---\n");
			});

			after(function() {
				fs.unlinkSync(playbookPath);
			});

			it('should indicate update action', function (done){
				var cb;

				cb = function(err, plan) {
					if (err) {
						done(err);
					}

					try {
						expect(plan).to.contain({
							action: 'UPDATE',
							path: playbookPath
						});
					} catch(e) {
						return done(e);
					}

					return done();
				};

				playbookDumper.plan(cb);
			});
		});
	});

	describe('when executed', function () {
		before(function () {
			playbookDumper = new PlaybookDumper(playbook);
			playbookDumper.setPath(playbookPath);
		});

		after(function () {
			fs.unlinkSync(playbookPath);
		});

		it('should create a playbook file', function (done) {
			var cb;

			cb = function (err, executedPlan) {
				var playbookContent;

				try {
					playbookContent = fs.readFileSync(playbookPath).toString();

					expect(executedPlan).to.contain({
						path: playbookPath
					});
					expect(playbookContent)
						.to.contain("---\n");
					expect(playbookContent)
						.to.contain("- name: " + playName);
				} catch(e) {
					return done(e);
				}

				return done();
			};

			playbookDumper.execute(cb);
		});
	});
});
