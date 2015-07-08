var https = require('https');
var querystring = require('querystring');

module.exports = {
	authenticate: function(login, token, cb) {
		var get_options = {
			'host': 'push.superfeedr.com',
			'port': '443',
			'path': '/?hub.mode=authenticate&rights=true',
			'auth': [login, token].join(':'),
			'method': 'GET',
		};

		var get_req = https.request(get_options, function(res) {
			var data = '';
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function() {
				if(res.statusCode == 204)
					return cb(null, true);

				else if(res.statusCode == 200)  {
					var j = JSON.parse(data);
					if(!j.subscribe)
						return cb(new Error('This token does not allow subscriptions'));
					return cb(null);
				}

				else {
					cb(new Error(res.statusCode, data));
				}
			})
		});
		get_req.end();
	},
	subscribe: function(url, cb) {
		var post_data = {
			'hub.mode': 'subscribe',
			'hub.topic': url,
			'format': 'json',
			'hub.callback': 'https://push.superfeedr.com/dev/null'
		};

		var post_options = {
			'host': 'push.superfeedr.com',
			'port': '443',
			'path': '/',
			'auth': [process.env['SUPERFEEDR_LOGIN'], process.env['SUPERFEEDR_TOKEN']].join(':'),
			'method': 'POST',
			'headers': {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': querystring.stringify(post_data).length
			}
		};

		var post_req = https.request(post_options, function(res) {
			var data = '';
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function() {
				if(res.statusCode == 204 || res.statusCode == 200) {
					cb(null, data);
				}
				else {
					cb(new Error(res.statusCode, data));
				}
			})
		});

		post_req.write(querystring.stringify(post_data));
		post_req.end();
	}
}