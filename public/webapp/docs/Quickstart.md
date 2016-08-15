# Meteor-UI5 Quickstart Guide
This guide will show you how to create an app that uses Meteor and UI5 in the minimum number of steps.  __This quickstart guide assumes some familiarity with both Meteor and UI5.__  We recommend that you do the [Meteor-UI5 Tutorial](/#/tutorial) for more in depth coverage.

## Creating your project
1. Create a new meteor project with `meteor create quickstart`.
1. Change into your newly created `quickstart` folder.
1. Delete the __contents__ of the `client` and `server` folders.
1. Create a folder called `public`.
1. In `public`, create a sub-folder called `webapp` for your UI5 code.
1. Remove Blaze with `meteor remove blaze-html-templates`.
1. Add static-html support with `meteor add static-html`.
1. Add the `meteor-ui5` package to your meteor project with `meteor add propellerlabsio:meteor-ui5`.
1. Create a file in the `client` folder called `index.html` file with the following contents:

### `client/index.html`
```html
<head>
<meta http-equiv='X-UA-Compatible' content='IE=edge' />
<title>My First Meteor-UI5 App</title>

<script id='sap-ui-bootstrap'
    src='https://openui5.hana.ondemand.com/1.38.4/resources/sap-ui-core.js'
    data-sap-ui-theme='sap_bluecrystal'
    data-sap-ui-libs='sap.m'
    data-sap-ui-resourceroots='{
      "webapp": "/webapp/",
      "meteor-ui5": "/packages/propellerlabsio_meteor-ui5/"
    }'
    data-sap-ui-compatVersion='edge'
    data-sap-ui-preload='async'>
</script>

<script>
     sap.ui.getCore().attachInit(function () {
         jQuery("#content").html("Hello World - UI5 is ready");
     });
</script>

</head>
<body class='sapUiBody'>
    <div id='content'></div>
</body>
```

## Run your project
1. From your project root directory, run `meteor`.
1. Go to [http://localhost:3000](http://localhost:3000) in your browser and confirm you can see the "Hello World" message.

## Next steps
1. Create your Meteor code (collections, methods etc) in the normal manner.
1. Create your UI5 user interface code in the `public/webapp` folder in the normal manner. Adjust the above `index.html` file to load your component or main view.
1. In your manifest, Component or view controller, you can instantiate a Meteor model with `new meteor-ui5.model.mongo.Model()`.  This will give you access to any collection that is available on the client.
1. In your UI5 views, you can bind to any Meteor collection using the following syntax:
`/<MongoCollectionName><(DocumentId)>/<PropertyPath>`.  Refer to the [Binding](/#/demo/binding/) and [Filtering](/#/demo/filter) demos for examples.
