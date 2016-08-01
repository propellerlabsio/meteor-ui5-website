// Proxy for Northwind OData service calls - can't call directly on the client
// due to CORS error (browser security)
// Uses package cfs:http-methods
// https://atmospherejs.com/cfs/http-methods

HTTP.methods({
  '/oDataProxy': callODataService,
  '/oDataProxy/:p1': callODataService,
  '/oDataProxy/:p1/:p2': callODataService
});

function callODataService() {

  const proxyUrl = this.request.originalUrl.substring(11);
  const url = 'http://services.odata.org/V2/Northwind/Northwind.svc' + proxyUrl;
  const response = HTTP.get(url);

  // Get service call response headers and add them to our response
  for (const property in response.headers) {
    if (response.headers.hasOwnProperty(property)) {
      this.addHeader(property, response.headers[property]);
    }
  }

  // Return service call content
  return response.content;
}
