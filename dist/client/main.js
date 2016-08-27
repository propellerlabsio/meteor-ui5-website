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
sap.ui.getCore().attachInit(function() {
  ui5Ready = true;
  renderAppIfAllReady();
});

function renderAppIfAllReady(){
  // Only continue if everything is ready.
  if (!tutorialsReady || !demosReady || ! ui5Ready){
    return;
  }

	// Create component deliberately (ie not automatically) so we can give
	// the component an id which can be used in sap.ui.getCore().getComponent()
	var oComponent = sap.ui.getCore().createComponent({
		name: "webapp",
		id: "webapp",
		height: "100%"
	});

	// Create component container for our component and mount it to the dom
	new sap.m.Shell({
		app: new sap.ui.core.ComponentContainer({
			component: oComponent
		})
	}).placeAt("content");


}
