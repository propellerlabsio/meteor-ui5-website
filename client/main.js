import '../imports/startup/client/';
let tutorialsReady = false;
let demosReady = false;
let ui5Ready = false;

// Subscribe to all demos here so we can produce menu contents
this._subscription = Meteor.subscribe("demos", () =>{
  demosReady = true;
  renderAppIfAllReady();
});

// Subscribe to all tutorials here so we can produce menu contents
this._subscription = Meteor.subscribe("tutorials", () =>{
  tutorialsReady = true;
  renderAppIfAllReady();
});

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

/**
 * If everything is ready, render app.
 */
function renderAppIfAllReady(){
  // Only continue if everything is ready.
  if (!tutorialsReady || !demosReady || ! ui5Ready){
    return;
  }

	// Create component container for our component and mount it to the dom
	new sap.m.Shell({
		app: new sap.ui.core.ComponentContainer({
			name: 'meteor-ui5-website'
		})
	}).placeAt("content");


}

