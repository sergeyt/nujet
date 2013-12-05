(function() {

	var getJson;

	// using nodejs callback convention (error, result)
	if (typeof jQuery !== 'undefined') {
		getJson = function(url, callback) {
			return jQuery.getJSON(url).done(function(data, status, xhr) {
				callback(null, data);
			}).fail(function(error) {
				callback(error, null);
			});
		};
	} else if (typeof module != 'undefined') {
		getJson = getJsonWithRequest(require('request'));
	} else if (typeof Meteor !== 'undefined'){
		if (Meteor.isServer){
			getJson = getJsonWithRequest(Npm.require('request'));
		} else {
			throw new Error('TODO implement with HTTP');
		}
	}

	function getJsonWithRequest(request){
		return function(url, callback) {
			request.get(url, function(err, res, body) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, JSON.parse(body));
				}
			});
		};
	}

	function nujet(options) {
		options = options || {};
		var endpoint = options.url || 'http://packages.nuget.org/v1/FeedService.svc/';

		// be friendly
		if (endpoint.charAt(endpoint.length - 1) !== '/'){
			endpoint += '/';
		}

		return {
			search: function(term, callback) {
				if (!term) {
					return getJson('Search', callback);
				}

				// TODO escape single quotes
				return getJson(endpoint + "Search?$format=json&searchTerm=" + "'" + term + "'", callback);
			}
		};
	}

	// default nuget endpoint
	var nuget = nujet();

	Object.keys(nuget).forEach(function(key){
		nujet[key] = nuget[key];
	});

	if (typeof module !== 'undefined') {
		module.exports = nujet;
	} else if (typeof Meteor !== 'undefined') {
		NuGet = nujet;
	} else {
		// browser
		window.NuGet = nujet;
	}

})();
