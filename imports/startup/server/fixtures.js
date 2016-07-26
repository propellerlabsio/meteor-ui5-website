import {
  Meteor
} from 'meteor/meteor';
import {
  bindingExamples,
  categories,
  customers,
  employees,
  orderDetails,
  orders,
  products,
  shippers,
  suppliers
} from '../../api/collections/collections.js';


Meteor.startup(() => {
  // code to run on server at startup
  loadFileIntoEmptyCollection('fixtures/Categories.json', categories, "CategoryID");
  loadFileIntoEmptyCollection('fixtures/Customers.json', customers, "CustomerID");
  loadFileIntoEmptyCollection('fixtures/Employees.json', employees, "EmployeeID");
  loadFileIntoEmptyCollection('fixtures/Shippers.json', shippers, "ShipperID");
  loadFileIntoEmptyCollection('fixtures/Suppliers.json', suppliers, "SupplierID");
  loadFileIntoEmptyCollection('fixtures/Products.json', products, "ProductID");
  loadFileIntoEmptyCollection('fixtures/BindingExamples.json', bindingExamples);

  loadOrders();
});

/**
 * Northwind source data has order details - ie products ordered - in separate entity.
 * In order to produce an example of nested documents (the mongo way) we will
 * merge both Orders and OrderDetails into the one Orders collection.
 */
function loadOrders() {
  debugger;
  if (!orders.find().count()) {
    console.log(`loading orders (2 files)...`);

    // Load orders
    let jsonFile = JSON.parse(Assets.getText('fixtures/Orders.json'));
    jsonFile.forEach((doc, index) => {
      // Insert converted document
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        "OrderID",
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            // Add array property to order for storing details
            cleaned.Details = [];
            orders.insert(cleaned);
          }
        }
      );
    });

    // Load order details
    jsonFile = JSON.parse(Assets.getText('fixtures/OrderDetails.json'));
    jsonFile.forEach((doc, index) => {
      // Get converted document
      debugger;
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            // Add details to existing order document
            orders.update({
              _id: doc.OrderID.toString()
            }, {
              $push: {Details: cleaned}
            });
          }
        }
      );
    });
  }
}

function loadFileIntoEmptyCollection(file, collection, idProperty) {
  // TODO Remove
  // collection.remove({});

  if (!collection.find().count()) {
    console.log(`loading ${file}...`);
    const jsonFile = JSON.parse(Assets.getText(file));

    // Clean up data
    jsonFile.forEach((doc, index) => {
      // Insert converted document
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        idProperty,
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            collection.insert(cleaned);
          }
        }
      );
    });
  }
}
