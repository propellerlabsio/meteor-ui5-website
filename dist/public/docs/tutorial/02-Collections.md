# Collections
In the [previous step](/#/tutorial/mongo/step/01) we set up a basic view with some dummy task data using a JSON Model.  In this step, we will swap out that model for a Mongo Model which will store and fetch our tasks from a real database hosted on the server.

## Create a Mongo collection
First create a folder in the project root called `imports`.  Code in this folder can be reused where it is needed using Meteor's ES6-compliant module system.   

In the `imports` folder create a folder called `api` and in this folder create a file called `tasks.js`.  Populate this last file with the following contents:

```js
import { Mongo } from 'meteor/mongo';

// Create a Mongo collection to store ToDo Tasks
export const Tasks = new Mongo.Collection('Tasks');
```

### Import the collection on the client


### Import the collection on the server

## Adjust view controller to use Mongo collection