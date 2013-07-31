function route(handle, pathName, response) {
	console.log("Routing request for: "+pathName);
	
	if(typeof(handle[pathName]) === 'function') {
		return handle[pathName](response);
	} else {
		console.log("No request handler found for: "+pathName);
		
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404: Page Not Found");
		response.end();
	}
}

exports.route = route;