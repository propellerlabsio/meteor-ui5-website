# Accounts Sign In/Out

In the [previous step](/#/tutorial/mongo/step/06) we added a way for them to show or hide their completed tasks.  In this step, we'll add a way to create and log in/out account.

## Add accounts password package to your project directory 

 Go to your project folder and enter `meteor add accounts-password`.

## Add UI5 form namespace to the view

 Add namespace `xmlns:form="sap.ui.layout.form` in `webapp/Tasks.view.xml`:

```xml
  <mvc:View controllerName="webapp.Tasks"
		height="100%"
		xmlns:mvc="sap.ui.core.mvc"
        xmlns:form="sap.ui.layout.form"
		xmlns:l="sap.ui.layout"
		xmlns="sap.m">
```
## Add the registration form to the view 
In the same file, add a user registration and login form at the top of the content section. 

```xml
  <content>
      <!-- Login form -->
    <form:SimpleForm editable="true" id="formId"
          maxContainerCols="2"
          layout="ResponsiveGridLayout"
          labelSpanL="4"
          labelSpanM="4"
          emptySpanL="4"
          emptySpanM="4">
          <Label text="Email"/>
          <Input id="inputEmail" type="Email"/>
          <Label text="Password"/>
          <Input id="inputPassword" type="Password"/>
      </form:SimpleForm>
```
## Add account buttons to the view

In the same file, below the form you just added, add a toolbar with buttons to handle different user account actions:
```xml
  </form:SimpleForm>

  <!-- User accounts toolbar -->
  <Toolbar>
    <ToolbarSpacer/>
    <Button id="idConfirmSignOut" text="Sign out" press="onSignOutAccount"></Button>
    <Button id="idConfirmCreate" text="Create account" press="onCreateAccount"></Button>
    <Button id="idConfirmLogin" text="Log in" press="onLogInAccount"></Button>
  </Toolbar>
```
## Create a function to get input value from input field

To create this function go to `webapp/Tasks.controller.js` file and place the codes below

```js
        return sText;
      }
    },
     getInputValues: function(){
      var oInputEmail = this.byId("inputEmail");
      var oInputPassword = this.byId("inputPassword");
      return {
        email: oInputEmail.getValue(),
        password: oInputPassword.getValue()
    }
  },
```
## Create a function to handle creating accounts

In `webapp/Tasks.controller.js` file create a function as below and add three functions at the end to handle showing or hiding buttons and task list

```js
   onCreateAccount: function(){
      var input = this.getInputValues();
      Accounts.createUser({ email: input.email, password: input.password }, (oError) => {
        if (oError){
          if (oError.message === "Email already exists. [403]") {
            MessageBox.information("Email already exists. Please log in with your password");
          } else if (oError.message === "Need to set a username or email [400]") {
            MessageBox.information("Need to provide email address");
          } else {
            MessageBox.error('Error Create Account', {
              details: oError.toString()
            });
          }
        } 
      });
    },
```
## Create a function to handle user logs in

In `webapp/Tasks.controller.js` file create a function as below and add codes to handle showing or hiding and filtering the task 

```js

    // Users can log in if they already created account
    onLogInAccount: function(){
      Meteor.loginWithPassword(input.email, input.password, (oError) => {
        if(oError){
          if(oError.message === "User not found [403]"){
            MessageBox.information("User not found. Please check your entries or create new account");
          } else if (oError.message === "Incorrect password [403]"){
            MessageBox.information("Incorrect password. Please try again");
          } else {
            MessageBox.error('Error Log In', {
              details: oError.toString()
            });
          }
        } 
      });
    },
```
## Create a function to handle user signs out

 In `webapp/Tasks.controller.js` file  create a function to handle log out as codes below

```js
    onSignOutAccount: function(){
      Meteor.logout((oError) => {
        if (oError){
          MessageBox.error("Error Logout", {
            details: oError.toString()
          })
        } 
      });
    }
```