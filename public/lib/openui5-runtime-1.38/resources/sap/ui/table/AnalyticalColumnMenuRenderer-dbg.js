/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './ColumnMenuRenderer'],
	function(jQuery, Renderer, ColumnMenuRenderer) {
	"use strict";


	/**
	 * AnalyticalTable renderer.
	 * @namespace
	 */
	var AnalyticalColumnMenuRenderer = Renderer.extend(ColumnMenuRenderer);

	return AnalyticalColumnMenuRenderer;

}, /* bExport= */ true);
