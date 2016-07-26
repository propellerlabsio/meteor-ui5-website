/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides helper sap.ui.table.TableKeyboardExtension.
sap.ui.define(['jquery.sap.global', './TableExtension', 'sap/ui/core/delegate/ItemNavigation', './TableUtils', './TableKeyboardDelegate' /*Switch to TableKeyboardDelegate2 for development of new keyboard behavior*/],
	function(jQuery, TableExtension, ItemNavigation, TableUtils, TableKeyboardDelegate) {
	"use strict";

	/*
	 * Wrapper for event handling of the item navigation.
	 * Allows to selectively forward the events to the item navigation.
	 * "this" in the function context is the table instance
	 */
	var ItemNavigationDelegate = {

		_forward : function(oTable, oEvent) {
			var oIN = oTable._getItemNavigation();
			if (oIN && !oTable._getKeyboardExtension()._itemNavigationSuspended && !oEvent.isMarked("sapUiTableSkipItemNavigation")) {
				oIN["on" + oEvent.type](oEvent);
			}
		},

		onfocusin : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapfocusleave : 		function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onmousedown : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapnext : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapnextmodifiers : 	function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapprevious : 		function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsappreviousmodifiers : function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsappageup : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsappagedown : 		function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsaphome : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsaphomemodifiers : 	function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapend : 				function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapendmodifiers : 	function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); },
		onsapkeyup : 			function(oEvent) { ItemNavigationDelegate._forward(this, oEvent); }

	};


	/*
	 * Event handling which is independent of the used keyboard delegate.
	 * "this" in the function context is the table instance.
	 */
	var ExtensionDelegate = {

		onfocusin : function(oEvent) {
			var oExtension = this._getKeyboardExtension();
			if (!oExtension._bIgnoreFocusIn) {
				oExtension.initItemNavigation();
				if (ExtensionHelper.isItemNavigationInvalid(this)) {
					oEvent.setMarked("sapUiTableInitItemNavigation");
				}
			} else {
				oEvent.setMarked("sapUiTableIgnoreFocusIn");
			}

			if (oEvent.target && oEvent.target.id === this.getId() + "-rsz") {
				// prevent that the ItemNavigation grabs the focus!
				// only for the column resizing
				oEvent.preventDefault();
				oEvent.setMarked("sapUiTableSkipItemNavigation");
			}
		}

	};


	/*
	 * Provides utility functions used this extension
	 */
	var ExtensionHelper = {

		/*
		 * Initialize ItemNavigations (content and header) and transfer relevant dom elements.
		 * TabIndexes are set by the ItemNavigation.
		 */
		_initItemNavigation : function(oExtension) {
			var oTable = oExtension.getTable();
			var $Table = oTable.$();
			var iColumnCount = TableUtils.getVisibleColumnCount(oTable);
			var iTotalColumnCount = iColumnCount;
			var bHasRowHeader = TableUtils.hasRowHeader(oTable);

			// create the list of item dom refs
			var aItemDomRefs = [];
			if (oTable.getFixedColumnCount() == 0) {
				aItemDomRefs = $Table.find(".sapUiTableCtrl td[tabindex]").get();
			} else {
				var $topLeft = $Table.find('.sapUiTableCtrlFixed.sapUiTableCtrlRowFixed');
				var $topRight = $Table.find('.sapUiTableCtrlScroll.sapUiTableCtrlRowFixed');
				var $middleLeft = $Table.find('.sapUiTableCtrlFixed.sapUiTableCtrlRowScroll');
				var $middleRight = $Table.find('.sapUiTableCtrlScroll.sapUiTableCtrlRowScroll');
				var $bottomLeft = $Table.find('.sapUiTableCtrlFixed.sapUiTableCtrlRowFixedBottom');
				var $bottomRight = $Table.find('.sapUiTableCtrlScroll.sapUiTableCtrlRowFixedBottom');
				for (var i = 0; i < oTable.getVisibleRowCount(); i++) {
					aItemDomRefs = aItemDomRefs.concat($topLeft.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
					aItemDomRefs = aItemDomRefs.concat($topRight.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
					aItemDomRefs = aItemDomRefs.concat($middleLeft.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
					aItemDomRefs = aItemDomRefs.concat($middleRight.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
					aItemDomRefs = aItemDomRefs.concat($bottomLeft.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
					aItemDomRefs = aItemDomRefs.concat($bottomRight.find('tr[data-sap-ui-rowindex="' + i + '"]').find('td[tabindex]').get());
				}
			}

			// to later determine the position of the first TD in the aItemDomRefs we keep the
			// count of TDs => aCount - TDs = first TD (add the row headers to the TD count / except the first one!)
			var iTDCount = aItemDomRefs.length;

			// add the row header items (if visible)
			if (bHasRowHeader) {
				var aRowHdrDomRefs = $Table.find(".sapUiTableRowHdr").get();
				for (var i = aRowHdrDomRefs.length - 1; i >= 0; i--) {
					aItemDomRefs.splice(i * iColumnCount, 0, aRowHdrDomRefs[i]);
					// we ignore the row headers
					iTDCount++;
				}
				// except the first row header
				iTDCount--;
				// add the row header to the column count
				iTotalColumnCount++;
			}

			// add the column headers and select all
			if (oTable.getColumnHeaderVisible()) {
				var aHeaderDomRefs = [];

				var $FixedHeaders = $Table.find(".sapUiTableColHdrFixed").children(); //returns the .sapUiTableColHdr elements
				var $ScrollHeaders = $Table.find(".sapUiTableColHdrScr").children(); //returns the .sapUiTableColHdr elements

				for (var i = 0; i < oTable._getHeaderRowCount(); i++) {
					if (bHasRowHeader) {
						aHeaderDomRefs.push(oTable.getDomRef("selall"));
					}

					if ($FixedHeaders.length) {
						aHeaderDomRefs = aHeaderDomRefs.concat(jQuery($FixedHeaders.get(i)).find(".sapUiTableCol").get());
					}
					if ($ScrollHeaders.length) {
						aHeaderDomRefs = aHeaderDomRefs.concat(jQuery($ScrollHeaders.get(i)).find(".sapUiTableCol").get());
					}
				}

				aItemDomRefs = aHeaderDomRefs.concat(aItemDomRefs);
			}

			// initialization of item navigation for the Table control
			if (!oExtension._itemNavigation) {
				oExtension._itemNavigation = new ItemNavigation();
				oExtension._itemNavigation.setTableMode(true);
				oExtension._itemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, function(oEvent) {
					var oInfo = TableUtils.getFocusedItemInfo(oTable);
					oInfo.header = oTable._getHeaderRowCount();
					oInfo.domRef = null; //Do not keep dom references

					if (oInfo.row >= oInfo.header) {
						oExtension._oLastFocusedCellInfo = oInfo;
					}
				}, oTable);
			}

			// configure the item navigation
			oExtension._itemNavigation.setColumns(iTotalColumnCount);
			oExtension._itemNavigation.setRootDomRef($Table.find(".sapUiTableCnt").get(0));
			oExtension._itemNavigation.setItemDomRefs(aItemDomRefs);
			oExtension._itemNavigation.setFocusedIndex(ExtensionHelper.getInitialItemNavigationIndex(oExtension));

			// revert invalidation flag
			oExtension._itemNavigationInvalidated = false;
		},

		getInitialItemNavigationIndex : function(oExtension) {
			return TableUtils.hasRowHeader(oExtension.getTable()) ? 1 : 0;
		},

		isItemNavigationInvalid : function(oExtension) {
			return !oExtension._itemNavigation || oExtension._itemNavigationInvalidated;
		}
	};

	/**
	 * Extension for sap.ui.table.Table which handles keyboard related things.
	 *
	 * @class Extension for sap.ui.table.Table which handles keyboard related things.
	 *
	 * @extends sap.ui.table.TableExtension
	 * @author SAP SE
	 * @version 1.38.4
	 * @constructor
	 * @private
	 * @alias sap.ui.table.TableKeyboardExtension
	 */
	var TableKeyboardExtension = TableExtension.extend("sap.ui.table.TableKeyboardExtension", /* @lends sap.ui.table.TableKeyboardExtension */ {

		/*
		 * @see TableExtension._init
		 */
		_init : function(oTable, sTableType, mSettings) {
			this._itemNavigation = null;
			this._itemNavigationInvalidated = false; // determines whether item navigation should be reapplied from scratch
			this._itemNavigationSuspended = false; // switch off event forwarding to item navigation
			this._type = sTableType;
			this._delegate = new TableKeyboardDelegate(sTableType);
			this._actionMode = false;

			// Register the delegates in correct order
			oTable.addEventDelegate(ExtensionDelegate, oTable);
			oTable.addEventDelegate(this._delegate, oTable);
			oTable.addEventDelegate(ItemNavigationDelegate, oTable);

			var that = this;
			oTable._getItemNavigation = function() { return that._itemNavigation; };

			return "KeyboardExtension";
		},

		/*
		 * @see sap.ui.base.Object#destroy
		 */
		destroy : function() {
			// Deregister the delegates
			var oTable = this.getTable();
			if (oTable) {
				oTable.removeEventDelegate(ExtensionDelegate);
				oTable.removeEventDelegate(this._delegate);
				oTable.removeEventDelegate(ItemNavigationDelegate);
			}

			if (this._itemNavigation) {
				this._itemNavigation.destroy();
				this._itemNavigation = null;
			}

			if (this._delegate) {
				this._delegate.destroy();
				this._delegate = null;
			}

			TableExtension.prototype.destroy.apply(this, arguments);
		}

	});


	/*
	 * Check whether item navigation should be reapplied from scratch and initializes it if needed.
	 * @public (Part of the API for Table control only!)
	 */
	TableKeyboardExtension.prototype.initItemNavigation = function() {
		if (ExtensionHelper.isItemNavigationInvalid(this)) {
			ExtensionHelper._initItemNavigation(this);
		}
	};


	/*
	 * Invalidates the item navigation (forces a re-initialization with the next initItemNavigation call)
	 * @public (Part of the API for Table control only!)
	 */
	TableKeyboardExtension.prototype.invalidateItemNavigation = function() {
		this._itemNavigationInvalidated = true;
	};


	/*
	 * Set or resets the action mode of the table.
	 * In the action mode the user can navigate through the interactive controls of the table.
	 * @public (Part of the API for Table control only!)
	 */
	TableKeyboardExtension.prototype.setActionMode = function(bActionMode, oArgs) {
		if (bActionMode && !this._actionMode && this._delegate.enterActionMode) {
			this._actionMode = !!this._delegate.enterActionMode.apply(this.getTable(), [oArgs || {}]);
		} else if (!bActionMode && this._actionMode && this._delegate.leaveActionMode) {
			this._actionMode = false;
			this._delegate.leaveActionMode.apply(this.getTable(), [oArgs || {}]);
		}
	};


	/*
	 * Returns true when the table is in action mode, false otherwise.
	 * @public (Part of the API for Table control only!)
	 */
	TableKeyboardExtension.prototype.isInActionMode = function() {
		return this._actionMode;
	};


	/*
	 * Sets the focus depending on the noData or overlay mode.
	 * The previous focused element is given (potentially this is not anymore the active focused element,
	 * e.g. see Table.setShowOverlay -> tue to CSS changes the focused element might be hidden which forces a focus change)
	 * @public (Part of the API for Table control only!)
	 */
	TableKeyboardExtension.prototype.updateNoDataAndOverlayFocus = function(oPreviousFocusRef) {
		var oTable = this.getTable();
		if (!oTable || !oTable.getDomRef()) {
			return;
		}

		if (oTable.getShowOverlay()) {
			// The overlay is shown
			if (jQuery.sap.containsOrEquals(oTable.getDomRef(), oPreviousFocusRef)) {
				oTable.$("overlay").focus(); // Set focus on Overlay Container if it was somewhere in the table before
			}
		} else if (TableUtils.isNoDataVisible(oTable)) {
			// The noData area is shown
			if (jQuery.sap.containsOrEquals(oTable.getDomRef("sapUiTableCnt"), oPreviousFocusRef)) {
				oTable.$("noDataCnt").focus(); // Set focus on NoData Container if it was on the content before
			}
		} else if (jQuery.sap.containsOrEquals(oTable.getDomRef("noDataCnt"), oPreviousFocusRef)
				|| jQuery.sap.containsOrEquals(oTable.getDomRef("overlay"), oPreviousFocusRef)) {
			// The overlay or noData area is not shown but was shown before
			TableUtils.focusItem(oTable, ExtensionHelper.getInitialItemNavigationIndex(this)); // Set focus on first focusable element
		}
	};


	/*
	 * Suspends the event handling of the item navigation.
	 * @protected (Only to be used by the keyboard delegate)
	 */
	TableKeyboardExtension.prototype._suspendItemNavigation = function() {
		this._itemNavigationSuspended = true;
	};


	/*
	 * Resumes the event handling of the item navigation.
	 * @protected (Only to be used by the keyboard delegate)
	 */
	TableKeyboardExtension.prototype._resumeItemNavigation = function() {
		this._itemNavigationSuspended = false;
	};


	/*
	 * Returns the combined info about the last focused data cell (based on the item navigation)
	 * @protected (Only to be used by the keyboard delegate)
	 */
	TableKeyboardExtension.prototype._getLastFocusedCellInfo = function() {
		var iHeader = this.getTable()._getHeaderRowCount();
		if (!this._oLastFocusedCellInfo || this._oLastFocusedCellInfo.header != iHeader) {
			var oInfo = TableUtils.getFocusedItemInfo(this.getTable());
			var iDfltIdx = ExtensionHelper.getInitialItemNavigationIndex(this);
			return {
				cellInRow : iDfltIdx,
				row : iHeader,
				header : iHeader,
				cellCount : oInfo.cellCount,
				columnCount : oInfo.columnCount,
				cell : oInfo.columnCount * iHeader + iDfltIdx
			};
		}
		return this._oLastFocusedCellInfo;
	};


	/*
	 * Sets the focus to the given DOM reference or jQuery Object and
	 * marks the resulting focus event to be ignored.
	 * @protected (Only to be used by the keyboard delegate)
	 */
	TableKeyboardExtension.prototype._setSilentFocus = function(oRef) {
		this._bIgnoreFocusIn = true;
		oRef.focus();
		this._bIgnoreFocusIn = false;
	};


	/*
	 * Returns the type of the related table
	 * @see TableExtension.TABLETYPES
	 * @protected (Only to be used by the keyboard delegate)
	 */
	TableKeyboardExtension.prototype._getTableType = function() {
		return this._type;
	};


	return TableKeyboardExtension;

}, /* bExport= */ true);