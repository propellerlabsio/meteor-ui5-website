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
export const demoGroups = new SafeCollection('DemoGroups');
export const tutorials = new SafeCollection('Tutorials');

// Publish
if (Meteor.isServer) {

  // Publish tutorials
  Meteor.publish('tutorials', () => {
    return tutorials.find();
  });

  // Publish demo groups
  Meteor.publish('demoGroups', () => {
    return demoGroups.find();
  });

  // Publish demos and associated groups
  Meteor.publishComposite('demos', {
    find: function() {
      return demos.find();
    },
    children: [{
      find: function(demo) {
        return demoGroups.find({
          _id: demo.groupId
        });
      }
    }]
  });
  // Publish employees
  Meteor.publish('employees', () => {
    return employees.find();
  });

  // Publish  orders and associated customers
  Meteor.publishComposite('ordersWithCustomers', {
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
