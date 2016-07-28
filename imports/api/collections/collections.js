import { Meteor } from 'meteor/meteor';
import SafeCollection from './SafeCollection.js';

// Sample Northwind data from oData service.  May not need all of these but
// leaving in at present.
export const categories = new SafeCollection('Categories');
export const customers = new SafeCollection('Customers');
export const employees = new SafeCollection('Employees');
export const orders = new SafeCollection('Orders');
export const products = new SafeCollection('Products');
export const shippers = new SafeCollection('Shippers');
export const suppliers = new SafeCollection('Suppliers');

// Internal collections
export const bindingExamples = new SafeCollection('BindingExamples');

// Publish
if (Meteor.isServer) {
  // Publish all employees
  Meteor.publish('employees', () => employees.find());

  // Publish all binding examples
  Meteor.publish('bindingExamples', () => bindingExamples.find());

  // Publish  orders
  Meteor.publish('orders', () => {
    // TODO: Remove limit when below is resolved
    // Limit publish to 20 orders as performance is killing us with the full
    // list of 830 orders until we get the observeChanges code sorted out in
    // the ListBinding model
    const limitSelector = {"_id": {$gte: "10248", $lte: "10267"}};
    var cursor = orders.find(limitSelector);
    console.log("Publishing " + cursor.count() + " orders.");
    return cursor;
  });

}
