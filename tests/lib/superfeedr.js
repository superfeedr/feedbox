var assert = require('assert');
var superfeedr = require(__dirname + '/../../lib/superfeedr.js');

describe('Superfeedr', function() {
	describe('authenticate', function() {
		it('should yield an error when login is missing', function(done) {
			superfeedr.authenticate('', '', function(err) {
				assert(err);
				done();
			})
		});

		it('should yield an error when token is missing', function(done) {
			superfeedr.authenticate(process.env['SF_TRACKER_USER'], '', function(err) {
				assert(err);
				done();
			})
		});


		it('should yield an error when token does not have the right subscribe credential', function(done) {
			superfeedr.authenticate(process.env['SF_TRACKER_USER'], process.env['SF_TRACKER_BAD_TOKEN'], function(err) {
				assert(err);
				done();
			})
		});


		it('should yield no error when the token has the right credentials', function(done) {
			superfeedr.authenticate(process.env['SF_TRACKER_USER'], process.env['SF_TRACKER_TOKEN'], function(err) {
				assert(!err);
				done();
			})
		});

	});

	describe('subscribe', function() {
		it('should subscribe to the feeds supplied', function(done) {
			superfeedr.subscribe('http://blog.superfeedr.com/atom.xml', function(err, data) {
				assert(!err);
				done();
			});
		})
	});

});