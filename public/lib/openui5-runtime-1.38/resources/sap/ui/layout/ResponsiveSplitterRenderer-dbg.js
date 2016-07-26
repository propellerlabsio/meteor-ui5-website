/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/IconPool'],
	function (IconPool) {
	"use strict";

	/**
	 * ResponsiveSplitter renderer.
	 * @namespace
	 */
	var ResponsiveSplitterRenderer = {};
	IconPool.insertFontFaceStyle();

	ResponsiveSplitterRenderer.render = function (oRm, oControl) {
		oRm.write("<div class='sapUiResponsiveSplitter'");
		oRm.writeControlData(oControl);
		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());
		oRm.writeStyles();
		oRm.write(">");

		var aPages = oControl.getAggregation("_pages");

		if (aPages) {
			oControl.getAggregation("_pages").forEach(oRm.renderControl);
			this.renderPaginator(oRm, oControl);
		}

		oRm.write("</div>");
	};

	ResponsiveSplitterRenderer.renderPaginator = function (oRm, oControl) {
		oRm.write("<div ");
		oRm.addClass("sapUiResponsiveSplitterPaginator");
		oRm.writeClasses();
		oRm.write(">");
		var bpCount = oControl._getMaxPageCount();

		oRm.write("<div ");
		oRm.addClass("sapUiResponsiveSplitterPaginatorNavButton");
		oRm.addClass("sapUiResponsiveSplitterHiddenPaginatorButton");
		oRm.addClass("sapUiResponsiveSplitterPaginatorButtonBack");
		oRm.writeClasses();
		oRm.write("></div>");

		oRm.write("<div ");
		oRm.addClass("sapUiResponsiveSplitterPaginatorButtons");
		oRm.writeClasses();
		oRm.write(">");

		for (var i = 0; i < bpCount; i++) {
			oRm.write("<div tabindex='0' ");
			oRm.write("page-index='" + i + "'");
			if (i === 0) {
				oRm.addClass("sapUiResponsiveSplitterPaginatorSelectedButton");
			}
			oRm.addClass("sapUiResponsiveSplitterHiddenElement");
			oRm.addClass("sapUiResponsiveSplitterPaginatorButton");
			oRm.writeClasses();
			oRm.write("></div>");
		}

		oRm.write("</div>");

		oRm.write("<div ");
		oRm.addClass("sapUiResponsiveSplitterPaginatorNavButton");
		oRm.addClass("sapUiResponsiveSplitterHiddenPaginatorButton");
		oRm.addClass("sapUiResponsiveSplitterPaginatorButtonForward");
		oRm.writeClasses();
		oRm.write("></div>");

		oRm.write("</div>");
	};

	return ResponsiveSplitterRenderer;

}, /* bExport= */ true);
