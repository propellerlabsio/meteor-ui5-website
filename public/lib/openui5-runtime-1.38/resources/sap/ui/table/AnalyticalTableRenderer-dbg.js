/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/IconPool', 'sap/ui/core/Renderer', './TableRenderer'],
	function(jQuery, IconPool, Renderer, TableRenderer) {
	"use strict";


	/**
	 * AnalyticalTable renderer.
	 * @namespace
	 */
	var AnalyticalTableRenderer = Renderer.extend(TableRenderer);

	AnalyticalTableRenderer.writeRowSelectorContent = function(rm, oTable, oRow, iRowIndex) {
		TableRenderer.writeRowSelectorContent(rm, oTable, oRow, iRowIndex);

		rm.write("<div");
		rm.writeAttribute("id", oRow.getId() + "-groupHeader");
		rm.writeAttribute("class", "sapUiTableGroupIcon");
		rm.writeAttribute("tabindex", "-1");
		rm.write("></div>");

		if ('ontouchstart' in document) {
			var oIconInfo = IconPool.getIconInfo("sap-icon://drop-down-list");
			rm.write("<div class='sapUiTableGroupMenuButton'>");
			rm.writeEscaped(oIconInfo.content);
			rm.write("</div>");
		}
	};

	return AnalyticalTableRenderer;

}, /* bExport= */ true);
