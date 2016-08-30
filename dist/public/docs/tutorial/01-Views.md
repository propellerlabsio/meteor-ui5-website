# Views
In the [previous step](/#/tutorial/mongo/step/00) you should have created a new project.  Now we will add a simple UI5 view to it with some fixed example data.

## View
Create a file called `Tasks.view.xml` in the `public/webapp` folder with the following contents:
```xml
<mvc:View controllerName="webapp.Tasks"
				height="100%"
				xmlns:mvc="sap.ui.core.mvc"
				xmlns:l="sap.ui.layout"
				xmlns="sap.m">

	<!-- Page for heading and content padding-->
	<Page title="Todo List"
					class="sapUiResponsiveContentPadding">
		<content>
			<!-- Grid for responsive layout on different devices -->
			<l:Grid defaultSpan="XL8 L8 M8 S12"
							defaultIndent="XL2 L2 M2 S0">

				<!-- Tasks list -->
				<List items="{/Tasks}">

					<!-- Task list item -->
					<StandardListItem title="{text}" />
				</List>
			</l:Grid>
		</content>
	</Page>
</mvc:View>
```
This view is a simple page with a list.  The items in the list are bound to something called `/Tasks` which we will define below.

## View controller
Now create a file called `Tasks.controller.js` in the `client/webapp` folder with the following contents:
```js
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  var CController = Controller.extend("webapp.Tasks", {

    onInit: function() {
      var oModel = new JSONModel({
        Tasks: [{
          text: 'This is task 1'
        }, {
          text: 'This is task 2'
        }, {
          text: 'This is task 3'
        }, ]
      });
      this.getView().setModel(oModel);
    }

  });

  return CController;

});
```
This view controller just sets up a new JSON model with some dummy data and sets the view to use this model.  You can think of JSON Models as temporary storage and they only exist on the client.  In a later step, we will switch this out to use a Meteor Mongo database collection.  But for now we just want to get some data on screen.

## Showing the view
Replace the contents of the `client/main.js` file with the following:
```js
sap.ui.getCore().attachInit(function() {
    // Create view
    const oView = sap.ui.xmlview({
        viewName: "webapp.Tasks"
    });

    // Add it to new Shell and place at content div
    new sap.m.Shell({
        app: oView
    }).placeAt("content");
});
```
In here we define what should happen when UI5 is initialized.  We've replaced our simple 'Hello World' message with the view we created earlier.  

## Testing
When you run your app you should now see this page:

![Step 01 Completed](/docs/tutorial/01-Views.png "Step 01 Completed")

## Next
In the [next step](/#/tutorial/mongo/step/02) we will swap out our JSON model for a real database hosted on the server.
