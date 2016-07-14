// Our version of Mongo.Collection that automatically disables all client side
// updates per the Meteor guide: http://guide.meteor.com/security.html#allow-deny

import { Mongo } from 'meteor/mongo';

export default class SafeCollection extends Mongo.Collection {
  constructor(...args) {
    // Throw instantiation to Mongo.Collection
    super(...args);

    // Deny all client side updates
    this.deny({
      insert() { return true; },
      update() { return true; },
      remove() { return true; },
    });
  }
}
