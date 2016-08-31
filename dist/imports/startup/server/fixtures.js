import {
  Meteor
} from 'meteor/meteor';
import {
  bindingExamples,
  categories,
  customers,
  demos,
  demoGroups,
  employees,
  orderDetails,
  orders,
  products,
  shippers,
  suppliers,
  tutorials
} from '../../api/collections/collections.js';


Meteor.startup(() => {
  // code to run on server at startup
  loadFileIntoEmptyCollection('fixtures/Categories.json', categories, "CategoryID");
  loadFileIntoEmptyCollection('fixtures/Customers.json', customers, "CustomerID");
  loadFileIntoEmptyCollection('fixtures/Employees.json', employees, "EmployeeID");
  loadFileIntoEmptyCollection('fixtures/Shippers.json', shippers, "ShipperID");
  loadFileIntoEmptyCollection('fixtures/Suppliers.json', suppliers, "SupplierID");
  loadFileIntoEmptyCollection('fixtures/Products.json', products, "ProductID");

  // Always reload the following files on server startup (they are small and
  // quickly loaded and may be frequently changing)
  loadFileReplaceCollection('fixtures/Tutorials.json', tutorials);
  loadFileReplaceCollection('fixtures/Demos.json', demos);
  loadFileReplaceCollection('fixtures/DemoGroups.json', demoGroups);

  loadOrders();
});

function loadFileReplaceCollection(file, collection, idProperty) {
  collection.remove({});
  loadFileIntoEmptyCollection(file, collection, idProperty);
}

/**
 * Northwind source data has order items detail - ie products ordered - in
 * separate entity. In order to produce an example of nested documents (the
 * mongo way) we will merge both Orders and OrderDetails into the one Orders
 * collection with OrderDetails in an "Items" property.
 */
function loadOrders() {
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
            cleaned.Items = [];
            orders.insert(cleaned);
          }
        }
      );
    });

    // Load order details into Items property of Orders
    jsonFile = JSON.parse(Assets.getText('fixtures/OrderDetails.json'));
    jsonFile.forEach((doc, index) => {
      // Get converted document
      const converted = Meteor.call(
        'fixtures.cleanDocument',
        doc,
        (error, cleaned) => {
          if (error) {
            console.error(error);
          } else {
            // Remove redundant OrderID property from item details
            delete cleaned.OrderID;

            // Add details to existing order document
            orders.update({
              _id: doc.OrderID.toString()
            }, {
              $push: {
                Items: cleaned
              }
            });
          }
        }
      );
    });
  }
}

function loadFileIntoEmptyCollection(file, collection, idProperty) {
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
