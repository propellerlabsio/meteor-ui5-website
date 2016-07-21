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

  let url = 'http://services.odata.org/V2/Northwind/Northwind.svc';

  // Build rest of url from parameters - painful we have to do it this way but there's
  // no way with http-methods to gulp the rest of a url after oDataProxy into one parameter
  if (this.params.p1) {
    url = url + "/" + this.params.p1;
    if (this.params.p2) {
      url = url + this.params.p2;

      // TODO: Add more parameters here as required
    }
  }
  console.log("Handling oDataProxy request for " + url);
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
