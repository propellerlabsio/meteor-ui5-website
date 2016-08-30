# Collections
In the [previous step](/#/tutorial/mongo/step/01) we set up a basic view with some dummy task data using a JSON Model.  In this step, we will swap out that model for a Mongo Model which will store and fetch our tasks from a real database hosted on the server.

## Create a Mongo collection
First create a folder in the project root called `imports`.  Code in this folder can be reused where it is needed using Meteor's JavaScript standards-compliant module system.   

In the `imports` folder create a folder called `api` and in this folder create a file called `tasks.js`.  Populate this last file with the following contents:

```js
import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store our tasks
export const tasks = new Mongo.Collection('Tasks');
```

There isn't much to this file yet but we will add to it later.

## Import the collection on the server
Create a file in your `server` folder called `main.js` with the following contents:
```js
import { tasks } from '../imports/api/tasks.js';
```

## Import the collection on the client
Insert the following code at the top of your `client/main.js` file:
```js
import '../imports/api/tasks.js';
```

## Adjust view to use Mongo collection
Now we will swap out the JSON Model we created in the previous step with a Mongo Model to use the MongoDB collection.  Make the following changes to your `public/Tasks.controller.js`:

### Import the Mongo Model
Change the imports at the top of the file to use the MongoModel instead of the JSON Model so that it looks like the following:
```diff
sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'meteor-ui5-mongo/model/Model'
], function(Controller, MongoModel) {
  "use strict";
```

### Instantiate the Mongo Model
Replace the code that instantiates the JSON Model in the `onInit` call back so that it looks like the following:
```js
    onInit: function() {
      var oModel = new MongoModel();
      this.getView().setModel(oModel);
    }
```

## Testing
If you run your app now, you will see the same screen as in the previous step but with no task data.  This is because we are now using the Mongo Collection as the source of our ToDos but it is empty and we haven't yet provided any way to insert tasks.  We will fix this in the next step but, in the mean time, you can add tasks using the Mongo shell as follows:
1. With meteor running, create another terminal session and switch to the same directory.
2. Run `meteor mongo`.
3. Insert tasks with the following command:
  `db.Tasks.insert({ text: "Hello world!", createdAt: new Date() });`
4. When you have finished adding tasks, enter `exit` to leave the mongo shell.

## Next
In the [next step](/#/tutorial/mongo/step/03) we will provide the user with a way to add their tasks to the database.