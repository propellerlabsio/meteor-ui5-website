import {
  Meteor
} from 'meteor/meteor';
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
export const demos = new SafeCollection('Demos');

// Publish
if (Meteor.isServer) {
  // Publish all demos
  Meteor.publish('demos', () => {
    return demos.find()
  });

  // Publish all employees
  Meteor.publish('employees', () => {
    return employees.find();
  });

  // Publish  orders and associated customers
  Meteor.publishComposite('orders', {
    find: function() {
      return orders.find();
    },
    children: [{
      find: function(order) {
        return customers.find({
          _id: order.CustomerID
        });
      }
    }]
  });

}
