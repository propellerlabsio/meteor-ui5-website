// Make collections available on the client
import {
  categories,
  customers,
  employees,
  orderDetails,
  orders,
  products,
  shippers,
  suppliers
} from '../../api/collections/collections.js';

// TODO move subscriptions into oModel
// Subscribe to all collections
Meteor.subscribe('categories');  
Meteor.subscribe('customers');
Meteor.subscribe('employees');
Meteor.subscribe('orderDetails');
Meteor.subscribe('orders');
Meteor.subscribe('products');
Meteor.subscribe('shippers');
Meteor.subscribe('suppliers');
