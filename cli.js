#!/usr/bin/env node --harmony

var program = require('commander');

program
	.version('0.0.1');

program
	.command('roles <action>')
	.action( function(action) {
		console.log('executing roles ' + action);
	});

// program
// 	.command('*')
// 	.action( function() {
// 		console.log('usage');
// 		program.help();
// 	});

program.parse(process.argv);
