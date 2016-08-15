# Meteor-UI5 Quickstart Guide
This guide will show you how to create an app that uses Meteor and UI5 in the minimum number of steps.  _It is not a substitute for understanding UI5 or Meteor._  We recommend that you do the [Meteor-UI5 Tutorial](/#/tutorial) for a more in depth example.

## Quickstart
1. Add the package to your meteor project with ```meteor add propellerlabsio:meteor-ui5```.
1. Remove Blaze
    1. Remove Blaze with `meteor remove blaze-html-templates`.
    2. Add static-html support with `meteor add static-html`.
1. Create a folder called `webapp` for your UI5 app in the public folder of the root directory.
    I.e. `/public/webapp`.
1. Bootstrap UI5.  
Create a single html file in your project's client folder.  In your app's HTML file, bootstrap UI5 in the manner [described in the OpenUI5 docs](http://openui5.org/getstarted.html#step1).  In your OpenUI5 bootstrap script, add the public folder you created in the previous step and meteor-ui5 as resource roots.  Do not include the `/public` part of your UI5 app folder path:
  ```json
data-sap-ui-resourceroots='{
  "myui5app": "/webapp/"
  "meteor-ui5": "/packages/propellerlabsio_meteor-ui5/"
}
  ```
1. Instantiate a meteor model for your UI5 views/controls.  You can reference any `meteor-ui5` component in any `sap.ui.define` like this:
  ```js
sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/m/MessageToast",
      "meteor-ui5/model/mongo/Model"
  ],
  function(Controller, MessageToast, MeteorModel) {
  ```

1. Access data from your meteor mongo collections. E.g:
  1. Controler code:
  ```js
    onInit: function() {
      // Create Meteor model
      var oModel = new MeteorModel();
      this.getView().setModel(oModel);
    },
  ```
  2. View code:
  ```xml
    <!-- List all orders in mongo collection Orders -->
    <Table id="OrdersTable" items="{/Orders}">
        <!-- Define your columns here -->
    <Table>
  ```
