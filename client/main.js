import '../imports/startup/client/';
let ui5Ready = false;
let domReady = false;

let meteorReady = true;

// Subscribe to all demos (async)
this._subscription = Meteor.subscribe("demos" );

// Subscribe to all tutorials (async)
this._subscription = Meteor.subscribe("tutorials");

// Render App when UI5 is ready
if (typeof sap !== 'undefined'){
  sap.ui.getCore().attachInit(function() {
    ui5Ready = true;
    renderAppIfAllReady();
  });
} else {
  $("#splash-screen").remove();
  var errorTemplate = $("#errorTemplate").html();
  $("body").append(errorTemplate);
}

renderAppIfAllReady();

/**
 * If everything is ready, render app.
 */
function renderAppIfAllReady(){
  // Only continue if everything we need is ready.
  if (!ui5Ready || !domReady){
    return;
  }

  // Remove splash screen from DOM
  $("#splash-screen").remove();
 
	// Create component container for our component and mount it to the dom
	new sap.m.Shell({
		app: new sap.ui.core.ComponentContainer({
			name: 'meteor-ui5-website'
		})
	}).placeAt("content");

}


/**
 * Show loading screen while UI5 is being loaded 
 * 
 * File contents copied from http://openui5.blogspot.com/2014/04/splash-screen.html?m=1
 */

// need to be executed in the onload event to
// ensure all libraries are properly loaded
window.onload = function () {
  // Flag document/DOM is ready
  domReady = true;

  if (window.cordova) {
    document.addEventListener("deviceready", renderAppIfAllReady(), false);
  } else {
    renderAppIfAllReady();
  }
}