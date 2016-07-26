/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.DragDrop.
sap.ui.define([
	'sap/ui/dt/Plugin',
	'sap/ui/dt/DOMUtil',
	'sap/ui/dt/OverlayUtil',
	'sap/ui/dt/ElementUtil'
],
function(Plugin, DOMUtil, OverlayUtil, ElementUtil) {
	"use strict";

	/**
	 * Constructor for a new DragDrop.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The DragDrop plugin is an abstract plugin to enable drag and drop functionality of the Overlays
	 * This Plugin should be overwritten by the D&D plugin implementations, the abstract functions should be used to perform actions
	 * @extends sap.ui.dt.plugin.Plugin
	 *
	 * @author SAP SE
	 * @version 1.38.4
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.plugin.DragDrop
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var DragDrop = Plugin.extend("sap.ui.dt.plugin.DragDrop", /** @lends sap.ui.dt.plugin.DragDrop.prototype */ {
		metadata : {
			"abstract" : true,
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
			},
			associations : {
			},
			events : {
			}
		}
	});

	/*
	 * @private
	 */
	DragDrop.prototype.init = function() {
		Plugin.prototype.init.apply(this, arguments);

		this._mElementOverlayDelegate = {
			"onAfterRendering" : this._checkMovable
		};

		this._mAggregationOverlayDelegate = {
			"onAfterRendering" : this._attachDragScrollHandler,
			"onBeforeRendering" : this._removeDragScrollHandler
		};

		this._dragScrollHandler = this._dragScroll.bind(this);
		this._dragLeaveHandler = this._dragLeave.bind(this);
		this._mScrollIntervals = {};
	};


	/*
	 * @private
	 */
	DragDrop.prototype.exit = function() {
		Plugin.prototype.exit.apply(this, arguments);

		delete this._mElementOverlayDelegate;
		delete this._mAggregationOverlayDelegate;
		delete this._dragScrollHandler;
	};

	/**
	 * @override
	 * @param {sap.ui.dt.Overlay} an Overlay which should be registered
	 */
	DragDrop.prototype.registerElementOverlay = function(oOverlay) {
		oOverlay.addEventDelegate(this._mElementOverlayDelegate, this);

		oOverlay.attachEvent("movableChange", this._onMovableChange, this);

		if (oOverlay.isMovable()) {
			this._attachDragEvents(oOverlay);
		}

		oOverlay.attachBrowserEvent("dragover", this._onDragOver, this);
		oOverlay.attachBrowserEvent("dragenter", this._onDragEnter, this);
	};


	/**
	 * @override
	 */
	DragDrop.prototype.registerAggregationOverlay = function(oAggregationOverlay) {
		oAggregationOverlay.attachTargetZoneChange(this._onAggregationTargetZoneChange, this);

		if (!sap.ui.Device.browser.webkit) {
			this._attachDragScrollHandler(oAggregationOverlay);
			oAggregationOverlay.addEventDelegate(this._mAggregationOverlayDelegate, this);
		}
	};

	/**
	 * @override
	 */
	DragDrop.prototype.deregisterElementOverlay = function(oOverlay) {
		oOverlay.removeEventDelegate(this._mElementOverlayDelegate, this);

		oOverlay.detachEvent("movableChange", this._onMovableChange, this);

		this._detachDragEvents(oOverlay);

		oOverlay.detachBrowserEvent("dragover", this._onDragOver, this);
		oOverlay.detachBrowserEvent("dragenter", this._onDragEnter, this);

	};

	/**
	 * @override
	 */
	DragDrop.prototype.deregisterAggregationOverlay = function(oAggregationOverlay) {
		oAggregationOverlay.detachTargetZoneChange(this._onAggregationTargetZoneChange, this);

		if (!sap.ui.Device.browser.webkit) {
			oAggregationOverlay.removeEventDelegate(this._mAggregationOverlayDelegate, this);
			this._removeDragScrollHandler(oAggregationOverlay);
			this._clearScrollIntervalFor(oAggregationOverlay.$().attr("id"));
		}
	};

	/**
	 * @private
	 * @param {sap.ui.dt.Overlay} an Overlay to attach events to
	 */
	DragDrop.prototype._attachDragEvents = function(oOverlay) {
		oOverlay.attachBrowserEvent("dragstart", this._onDragStart, this);
		oOverlay.attachBrowserEvent("drag", this._onDrag, this);
		oOverlay.attachBrowserEvent("dragend", this._onDragEnd, this);
	};

	/**
	 * @private
	 * @param {sap.ui.dt.Overlay} an Overlay to detach events from
	 */
	DragDrop.prototype._detachDragEvents = function(oOverlay) {
		oOverlay.detachBrowserEvent("dragstart", this._onDragStart, this);
		oOverlay.detachBrowserEvent("dragend", this._onDragEnd, this);
		oOverlay.detachBrowserEvent("drag", this._onDrag, this);
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.onMovableChange = function(oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDragStart = function(oDraggedOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDragEnd = function(oDraggedOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDrag = function(oDraggedOverlay, oEvent) { };

	/**
	 * @return {boolean} return true to omit event.preventDefault
	 * @protected
	 */
	DragDrop.prototype.onDragEnter = function(oOverlay, oEvent) { };

	/**
	 * @return {boolean} return true to omit event.preventDefault
	 * @protected
	 */
	DragDrop.prototype.onDragOver = function(oOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragEnter = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragOver = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragLeave = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDrop = function(oAggregationOverlay, oEvent) { };

	/**
	 * @private
	 */
	DragDrop.prototype._checkMovable = function(oEvent) {
		var oOverlay = oEvent.srcControl;
		if (oOverlay.isMovable()) {
			DOMUtil.setDraggable(oOverlay.$(), true);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onMovableChange = function(oEvent) {
		var oOverlay = oEvent.getSource();
		if (oOverlay.isMovable()) {
			this._attachDragEvents(oOverlay);
		} else {
			this._detachDragEvents(oOverlay);
		}

		this.onMovableChange(oOverlay, oEvent);
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDragStart = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);

		oEvent.stopPropagation();

		// Fix for Firfox - Firefox only fires drag events when data is set
		if (sap.ui.Device.browser.firefox && oEvent && oEvent.originalEvent && oEvent.originalEvent.dataTransfer && oEvent.originalEvent.dataTransfer.setData) {
			oEvent.originalEvent.dataTransfer.setData('text/plain', '');
		}

		this.showGhost(oOverlay, oEvent);
		this.onDragStart(oOverlay, oEvent);
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.showGhost = function(oOverlay, oEvent) {
		var that = this;

		// not supported in IE10+
		if (oEvent && oEvent.originalEvent && oEvent.originalEvent.dataTransfer && oEvent.originalEvent.dataTransfer.setDragImage) {
			this._$ghost = this.createGhost(oOverlay, oEvent);

			// ghost should be visible to set it as dragImage
			this._$ghost.appendTo("#overlay-container");
			// if ghost will be removed without timeout, setDragImage won't work
			setTimeout(function() {
				that._removeGhost();
			}, 0);
			oEvent.originalEvent.dataTransfer.setDragImage(
				this._$ghost.get(0),
				oEvent.originalEvent.pageX - oOverlay.$().offset().left,
				oEvent.originalEvent.pageY - oOverlay.$().offset().top
			);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._removeGhost = function() {
		this.removeGhost();
		delete this._$ghost;
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.removeGhost = function() {
		var $ghost = this.getGhost();
		if ($ghost) {
			$ghost.remove();
		}
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.createGhost = function(oOverlay) {
		var oGhostDom = oOverlay.getAssociatedDomRef();
		var $ghost;
		if (!oGhostDom) {
			oGhostDom = this._getAssociatedDomCopy(oOverlay);
			$ghost = jQuery(oGhostDom);
		} else {
			$ghost = jQuery("<div></div>");
			DOMUtil.cloneDOMAndStyles(oGhostDom, $ghost);
		}

		var $ghostWrapper = jQuery("<div></div>").addClass("sapUiDtDragGhostWrapper");
		return $ghostWrapper.append($ghost.addClass("sapUiDtDragGhost"));
	};

	/**
	 * @private
	 */
	DragDrop.prototype._getAssociatedDomCopy = function(oOverlay) {
		var that = this;

		var $DomCopy = jQuery("<div></div>");

		oOverlay.getAggregationOverlays().forEach(function(oAggregationOverlay) {
			oAggregationOverlay.getChildren().forEach(function(oChildOverlay) {
				var oChildDom = oChildOverlay.getAssociatedDomRef();
				if (oChildDom) {
					DOMUtil.cloneDOMAndStyles(oChildDom, $DomCopy);
				} else {
					DOMUtil.cloneDOMAndStyles(that._getAssociatedDomCopy(oChildOverlay), $DomCopy);
				}
			});
		});

		return $DomCopy.get(0);
	};

	/**
	 * @protected
	 * @return {jQuery} jQuery object drag ghost
	 */
	DragDrop.prototype.getGhost = function() {
		return this._$ghost;
	};


	/**
	 * @private
	 */
	DragDrop.prototype._onDragEnd = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this._removeGhost();

		this._clearAllScrollIntervals();
		this.onDragEnd(oOverlay, oEvent);

		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDrag = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);

		this.onDrag(oOverlay, oEvent);

		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDragEnter = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		if (OverlayUtil.isInTargetZoneAggregation(oOverlay)) {
			//if "true" returned, propagation won't be canceled
			if (!this.onDragEnter(oOverlay, oEvent)) {
				oEvent.stopPropagation();
			}
		}

		oEvent.preventDefault();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDragOver = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		if (OverlayUtil.isInTargetZoneAggregation(oOverlay)) {
			//if "true" returned, propagation won't be canceled
			if (!this.onDragOver(oOverlay, oEvent)) {
				oEvent.stopPropagation();
			}
		}

		oEvent.preventDefault();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationTargetZoneChange = function(oEvent) {
		var oAggregationOverlay = oEvent.getSource();
		var bTargetZone = oEvent.getParameter("targetZone");

		if (bTargetZone) {
			this._attachAggregationOverlayEvents(oAggregationOverlay);
		} else {
			this._detachAggregationOverlayEvents(oAggregationOverlay);
		}

	};

	/**
	 * @private
	 */
	DragDrop.prototype._attachAggregationOverlayEvents = function(oAggregationOverlay) {

		oAggregationOverlay.attachBrowserEvent("dragenter", this._onAggregationDragEnter, this);
		oAggregationOverlay.attachBrowserEvent("dragover", this._onAggregationDragOver, this);
		oAggregationOverlay.attachBrowserEvent("dragleave", this._onAggregationDragLeave, this);
		oAggregationOverlay.attachBrowserEvent("drop", this._onAggregationDrop, this);
	};

	/**
	 * @private
	 */
	DragDrop.prototype._detachAggregationOverlayEvents = function(oAggregationOverlay) {
		oAggregationOverlay.detachBrowserEvent("dragenter", this._onAggregationDragEnter, this);
		oAggregationOverlay.detachBrowserEvent("dragover", this._onAggregationDragOver, this);
		oAggregationOverlay.detachBrowserEvent("dragleave", this._onAggregationDragLeave, this);
		oAggregationOverlay.detachBrowserEvent("drop", this._onAggregationDrop, this);
	};


	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragEnter = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragEnter(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragOver = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragOver(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragLeave = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragLeave(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDrop = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDrop(oAggregationOverlay, oEvent);

		oEvent.stopPropagation();
	};


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Scroll ondrag enablement (only for non-webkit browsers) *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	var I_SCROLL_TRAP_SIZE = 100;
	var I_SCROLL_STEP = 20;
	var I_SCROLL_INTERVAL = 50;

	/**
	 * @private
	 */
	DragDrop.prototype._clearScrollInterval = function(sElementId, sDirection) {
		if (this._mScrollIntervals[sElementId]) {
			window.clearInterval(this._mScrollIntervals[sElementId][sDirection]);
			delete this._mScrollIntervals[sElementId][sDirection];
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._clearScrollIntervalFor = function(sElementId) {
		var that = this;

		if (this._mScrollIntervals[sElementId]) {
			Object.keys(this._mScrollIntervals[sElementId]).forEach(function(sDirection) {
				that._clearScrollInterval(sElementId, sDirection);
			});
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._clearAllScrollIntervals = function() {
		Object.keys(this._mScrollIntervals).forEach(this._clearScrollIntervalFor.bind(this));
	};

	/**
	 * @private
	 */
	DragDrop.prototype._checkScroll = function($element, sDirection, iEventOffset) {
		var iSize;
		var fnScrollFunction;
		var iScrollMultiplier = 1;

		if (sDirection === "top" || sDirection === "bottom") {
			iSize = $element.height();
			fnScrollFunction = $element.scrollTop.bind($element);
		} else {
			iSize = $element.width();
			fnScrollFunction = $element.scrollLeft.bind($element);
		}
		if (sDirection === "top" || sDirection === "left") {
			iScrollMultiplier = -1;
		}

		// ensure scroll trap size isn't be bigger then ¼ of the container size
		var iSizeQuarter = Math.floor(iSize / 4);
		var iTrapSize = I_SCROLL_TRAP_SIZE;
		if (iSizeQuarter < I_SCROLL_TRAP_SIZE) {
			iTrapSize = iSizeQuarter;
		}


		if (iEventOffset < iTrapSize) {
			this._mScrollIntervals[$element.attr("id")] = this._mScrollIntervals[$element.attr("id")] || {};
			if (!this._mScrollIntervals[$element.attr("id")][sDirection]) {
				this._mScrollIntervals[$element.attr("id")][sDirection] = window.setInterval(function() {
					var iInitialScrollOffset = fnScrollFunction();
					fnScrollFunction(iInitialScrollOffset + iScrollMultiplier * I_SCROLL_STEP);
				}, I_SCROLL_INTERVAL);
			}
		} else {
			this._clearScrollInterval($element.attr("id"), sDirection);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._dragLeave = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);

		this._clearScrollIntervalFor(oAggregationOverlay.$().attr("id"));
	};

	/**
	 * @private
	 */
	DragDrop.prototype._dragScroll = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		var $aggregationOverlay = oAggregationOverlay.$();

		var iDragX = oEvent.clientX;
		var iDragY = oEvent.clientY;

		var oOffset = $aggregationOverlay.offset();
		var iHeight = $aggregationOverlay.height();
		var iWidth = $aggregationOverlay.width();

		var iTop = oOffset.top;
		var iLeft = oOffset.left;
		var iBottom = iTop + iHeight;
		var iRight = iLeft + iWidth;

		this._checkScroll($aggregationOverlay, "bottom", iBottom - iDragY);
		this._checkScroll($aggregationOverlay, "top", iDragY - iTop);
		this._checkScroll($aggregationOverlay, "right", iRight - iDragX);
		this._checkScroll($aggregationOverlay, "left", iDragX - iLeft);
	};

	/**
	 * @private
	 */
	DragDrop.prototype._attachDragScrollHandler = function(oEventOrAggregationOverlay) {
		var oAggregationOverlay;
		if (ElementUtil.isInstanceOf(oEventOrAggregationOverlay, "sap.ui.dt.AggregationOverlay")) {
			oAggregationOverlay = oEventOrAggregationOverlay;
		} else {
			oAggregationOverlay = oEventOrAggregationOverlay.srcControl;
		}

		if (DOMUtil.hasScrollBar(oAggregationOverlay.$())) {
			oAggregationOverlay.getDomRef().addEventListener("dragover", this._dragScrollHandler, true);
			oAggregationOverlay.getDomRef().addEventListener("dragleave", this._dragLeaveHandler, true);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._removeDragScrollHandler = function(oEventOrAggregationOverlay) {
		var oAggregationOverlay;
		if (ElementUtil.isInstanceOf(oEventOrAggregationOverlay, "sap.ui.dt.AggregationOverlay")) {
			oAggregationOverlay = oEventOrAggregationOverlay;
		} else {
			oAggregationOverlay = oEventOrAggregationOverlay.srcControl;
		}

		var oDomRef = oAggregationOverlay.getDomRef();

		if (oDomRef) {
			oDomRef.removeEventListener("dragover", this._dragScrollHandler, true);
		}
	};

	return DragDrop;
}, /* bExport= */ true);
