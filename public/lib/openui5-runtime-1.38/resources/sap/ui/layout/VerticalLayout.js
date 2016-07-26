/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/EnabledPropagator','./library'],function(q,C,E,l){"use strict";var V=C.extend("sap.ui.layout.VerticalLayout",{metadata:{library:"sap.ui.layout",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},designTime:true}});V.prototype.setWidth=function(w){this.setProperty("width",w,true);if(this.getDomRef()){this.getDomRef().style.width=this.getWidth();}return this;};V.prototype.getAccessibilityInfo=function(){var c=this.getContent();var a=[];for(var i=0;i<c.length;i++){if(c[i].getAccessibilityInfo){var I=c[i].getAccessibilityInfo();if(I){a.push(I);}}}return{children:a};};E.call(V.prototype);return V;},true);
