/*!
 * ${copyright}
 */

sap.ui.define([
  'jquery.sap.global',
  'sap/ui/model/Model'
 ],
	function(jQuery,  Model) {
	"use strict";


  var MeteorModel = Model.extend("sap.ui.model.MeteorModel", {

		constructor : function() {
      if (!Meteor){
        console.error("Meteor not found or not running.");
      }
			Model.apply(this, arguments);

		},

		metadata : {
			publicMethods : [] // ["loadData", "setData", "getData", "setProperty", "forceNoCache"]
		}

	});


	return MeteorModel;

});
