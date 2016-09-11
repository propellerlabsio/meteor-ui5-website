# Meteor-UI5 Quickstart Guide
This guide will show you how to set up a new Meteor UI5 project.  

## Prerequisites
Before proceeding you need to have at least version 1.4 of Meteor installed on your machine.  
* To install Meteor follow [these instructions](https://www.meteor.com/install).
* To check which version of Meteor is installed, run `meteor --version`.
* To upgrade your Meteor install, run `meteor update`.


## Creating your project
1. Create a new folder for your project and change directory to it.
1. Create a folder called `public` in your project directory.
1. In `public`, create a sub-folder called `webapp` for your UI5 code.
1. In the root folder of your project, create a new meteor project with `meteor create .` (don't leave out the trailing dot).  This will automatically create `client` and `server` folders in your project folder.
1. Your project folder should now have the following empty folders:

| Path     | Purpose |
| -------- | ------- |
|          | Any JavaScript in here will run on both the Meteor client and server. |
| `client` | Any files in here will only run on the Meteor client. |
| `public` | Any files in here will be served as-is by the Meteor server. |
| `public/webapp` | All of your UI5 code will go in here. |
| `server` | Any files in here will only run on the Meteor server. |

## Installing the Meteor UI5 package
1. Remove Blaze with `meteor remove blaze-html-templates`.		
1. Add static-html support with `meteor add static-html`.
1. Add the [`meteor-ui5-debug`](https://github.com/propellerlabsio/meteor-ui5-debug) package to your meteor project with `meteor add propellerlabsio:meteor-ui5-debug`.
1. Add the [`meteor-ui5-mongo`](https://github.com/propellerlabsio/meteor-ui5-mongo) package to your meteor project with `meteor add propellerlabsio:meteor-ui5-mongo`.

## Bootstraping UI5
1. In the `client` folder, create a file called `index.html` with the following contents:

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
      "meteor-ui5-mongo": "/packages/propellerlabsio_meteor-ui5-mongo/"
    }'
    data-sap-ui-compatVersion='edge'
    data-sap-ui-preload='async'>
</script>
</head>
<body class='sapUiBody'>
    <div id='content'></div>
</body>
```

## Create content placeholder
1. In the `client` folder, create a file called `main.js` with the following contents:

```js
  // Show something when UI5 is ready
  sap.ui.getCore().attachInit(function () {
     jQuery("#content").html("Hello World - UI5 is ready");
  });
```

## Run your project
1. From your project root directory, run `meteor`.
1. Go to [http://localhost:3000](http://localhost:3000) in your browser and confirm you can see the "Hello World" message.

## Next steps

### Beginners
If you are not familiar with both Meteor and UI5, we recommend that you complete the [Meteor-UI5 Tutorial](/#/tutorial/mongo/step/00) which will guide you through the steps to create a simple app.

### Experts
If you are already familiar with both Meteor and UI5, you can proceed to build your app as follows:
1. Create your Meteor code (collections, methods etc) in the normal manner.
1. Create your UI5 user interface code in the `public/webapp` folder in the normal manner. Adjust the `client/main.js` file to load your component or main view instead of the Hello World message.
1. In your manifest, Component or view controller, create or set the model using type  `meteor-ui5-mongo.model.Model` with no arguments.  This will give you access to any Mongo collection that is available on the client.
1. In your UI5 views, you can bind to any Meteor collection using the following syntax:
`/<MongoCollectionName><(DocumentId)>/<PropertyPath>`.  Refer to the [Binding](/#/demos?groupId=1-binding) and [Filtering](/#/demos?groupId=2-filter) demos for examples.
