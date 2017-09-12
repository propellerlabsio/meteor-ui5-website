# Accounts-Task-List

In the [previous step](/#/tutorial/mongo/step/07) we add a way for them to create and log in/out to account.  In this step, we'll add a way for them to show or hide button and filter task list against user id.

## Dynamically hide or show the task list 

In `webapp/Tasks.controller.js`, add a function to hide or show the Task list depending on whether a user is logged in or not:

```js
    },

    hideOrShowTaskList: function(){
      if (!Meteor.user()){
        var oTasks = this.byId('TaskList');
        oTasks.setVisible(false);
      } else {
        var oTasks = this.byId('TaskList');
        oTasks.setVisible(true);
      }
    },

    getTaskTextAsHtml: function(bChecked, sText){
```

## Add code to initialize the task list and user toolbar state

In the same file, at the bottom of the `onInit` method, add code to initialize the state of the new toolbar and the task list.

```js
      // Show or hide the task list depending on whether a user is logged in or not
      this.hideOrShowTaskList();

      // Set sign out button to invisible when the app runs initially
      var oBtnSignOut = this.byId("idConfirmSignOut");
      oBtnSignOut.setVisible(false);
    },
```

## Change the state of the buttons based on whether the user is logged in or not
To add this function go to `webapp/Tasks.controller.js` file and add the codes below

```js
   showOrHideAccountButtons: function(){
      if (Meteor.user()){
        var oSimpleForm = this.byId("formId");
        oSimpleForm.setVisible(false);
        var oBtnSignOut = this.byId("idConfirmSignOut");
        oBtnSignOut.setVisible(true);
        var oBtnCreateAccount = this.byId("idConfirmCreate");
        oBtnCreateAccount.setVisible(false);
        var oBtnLogInAccount = this.byId("idConfirmLogin");
        oBtnLogInAccount.setVisible(false);
      }
    },
```

## Hide or show button and filter task list when account is created

In `webapp/Tasks.controller.js` place the codes to on create account function as below 

```js
            });
          }
        } else {
          // Call these functions to hide or show buttons and filter the task list 
          this.showOrHideAccountButtons();
          this.hideOrShowTaskList();
          this.onFilterTasks();
        }
      });
    },
```
## Show or hide button and show the task list against user id when user is logged in

In `webapp/Tasks.controller.js` file add codes to handle showing or hiding and filtering the task when user is logged in

```js
              details: oError.toString()
            });
          }
          // Call these functions to show task list by user id and hide or show button if no error log in 
        } else if (Meteor.user()){
          var oTasks = this.byId('TaskList');
          oTasks.setVisible(true);
          this.showOrHideAccountButtons();
          this.onFilterTasks();
        }
      });
    },
```

## Show the completed tasks against user Id 

In `webapp/Tasks.controller.js` file. On the top of `onPressShowCompleted` function add the codes to filter the task 

```js
    // Create variable to store user objects 
      var oUser = Meteor.user();

           value1: true
        }));
      }
      // If user logs in, show the task list against user id 
      if (oUser._id){
        aFilters.push(new Filter({
          path: 'userId',
          operator: FilterOperator.EQ,
          value1: oUser._id
        }));
      }
     // Set filter
      var oTaskList = this.byId("TaskList");
      oTaskList.getBinding('items').filter(aFilters);
    },
```

## Store user id of the whoever is logged in againsts the task when adding new tasks
In `webapp/Tasks.controller.js` file add the codes to `onAddTask` function to store user id against the task
```js
    {
      var oUser = Meteor.user();
      if (oUser._id){

        this.oTasks.insert({
          userId: oUser._id,
        });
        oInput.setValue();
      }
    },
```

## Users can delete tasks if they are logged in
Go to your `webapp/Tasks.controller.js` file and in `onPressDeleteTask` function add codes below
```js
   {

      if (Meteor.user()){

        var oListItem = oEvent.getSource();
      }
    },
```

## Whoever is logged in, he or she can check his or her completed tasks  
Go to your `webapp/Tasks.controller.js` file and in `onSelectionChange` function add codes below 
```js
     {

      if (Meteor.user()){

        var oListItem = oEvent.getParameters().listItem;
      }
    },
```

## Filter the tasks list by the currently signed in user

Add a filter to your view controller in `webapp/Tasks.controller.js` file 

```js
   onFilterTasks: function(){
      var oUser = Meteor.user();
      if (oUser._id) {
        var aFilter = new Filter({
          path: 'userId',
          operator: FilterOperator.EQ,
          value1: oUser._id
        });
        // Apply for filter 
        var oList = this.byId('TaskList');
        oList.getBinding('items').filter(aFilter);
      }
    },
``` 
## Change state of the form and buttons whether user is logged in or not

 In `webapp/Tasks.controller.js` file  create a function to handle log out as codes below

```js
  
            details: oError.toString()
          })
        } else {
          // Change state of the form and buttons whether user logged in or not
          var oSimpleForm = this.byId("formId");
          oSimpleForm.setVisible(true);
          var oBtnSignOut = this.byId("idConfirmSignOut");
          oBtnSignOut.setVisible(false);
          var oBtnCreateAccount = this.byId("idConfirmCreate");
          oBtnCreateAccount.setVisible(true);
          var oBtnLogInAccount = this.byId("idConfirmLogin");
          oBtnLogInAccount.setVisible(true);
          this.hideOrShowTaskList();
        }
      });
    }
```
## Testing

If all is well, you should see the below when you run your app:

### Log in

Note, if you don't have any accounts yet. Please create new account
![Step 07 Show - Task form](/docs/tutorial/07-AccountsA.png "Step 07 Show - Task form") 

### Log in results 

![Step 07 Show - Task form  result](/docs/tutorial/07-AccountsB.png "Step 07 Show - Task form result")

## Next

Further tutorial steps are still being written.  In these steps we will cover:
* Securing your app with Meteor server methods 
* Securing your app with collection publications and subscriptions.

Bookmark this page and check back soon for these new tutorial steps.  In the mean time, the following resources might be useful for learning more about Meteor and/or UI5:

| Resource | Description |
| -------- | ----------- |
| [Meteor Guide](https://guide.meteor.com/) | Best-practice meteor guide.  Although targetted to the MDG supported view layers (Blaze, React and Angular) there is a wealth of information that will be applicable to your meteor-UI5 projects. |
| [Meteor Docs](http://docs.meteor.com/) | API docs. See note re relevance above. |
| [UI5 Development toolkit](https://openui5.hana.ondemand.com/#docs/guide/95d113be50ae40d5b0b562b84d715227.html) | If you are relatively new to UI5 then the Walkthrough Tutorial is an excellent resource and highly recommended.  Note that 99.9% of this tutorials is directly relevant to Meteor-UI5 projects however you should bootstrap UI5 and launch your app or view using the file structure outlined in the Quickstart guide. |