var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "esri/layers/support/LabelClass", "esri/symbols", "./renderers"], function (require, exports, LabelClass, symbols_1, renderers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var aboveColor = "#018571";
    var belowColor = "#a6611a";
    var haloColor = "#f7ebd6";
    var haloSize = 1;
    var commonProperties = {
        xoffset: -8,
        yoffset: -8,
        horizontalAlignment: "left",
        haloColor: haloColor,
        haloSize: haloSize
    };
    var labelExpressionInfo = {
        expression: "Replace($feature.Park, 'National Park', '')"
    };
    var labelPlacement = "above-right";
    var deconflictionStrategy = "static";
    function createLabelingInfo(year) {
        if (renderers_1.RendererVars.rendererType === "bivariate") {
            return createBasicLabelingInfo(year);
        }
        return createChangeLabelingInfo(year);
    }
    exports.createLabelingInfo = createLabelingInfo;
    function createBasicLabelingInfo(year) {
        return [
            new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 3000000",
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 12,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: aboveColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 1000000 AND F" + year + " < 3000000",
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 9,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: aboveColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " < 1000000",
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 8,
                        family: "Noto Sans"
                    }, color: aboveColor }, commonProperties))
            })
        ];
    }
    function createChangeLabelingInfo(year) {
        var previousYear = year - 1;
        var aboveWhere = "AND (F" + year + " >= F" + previousYear + ")";
        var belowWhere = "AND (F" + year + " < F" + previousYear + ")";
        return [
            // above
            new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 3000000 " + aboveWhere,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 12,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: aboveColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 1000000 AND F" + year + " < 3000000 " + aboveWhere,
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 9,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: aboveColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " < 1000000 " + aboveWhere,
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 8,
                        family: "Noto Sans"
                    }, color: aboveColor }, commonProperties))
            }),
            // below
            new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 3000000 " + belowWhere,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 12,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: belowColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " >= 1000000 AND F" + year + " < 3000000 " + belowWhere,
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 9,
                        family: "Noto Sans",
                        weight: "bold"
                    }, color: belowColor }, commonProperties))
            }), new LabelClass({
                deconflictionStrategy: deconflictionStrategy,
                where: "F" + year + " < 1000000 " + belowWhere,
                // minScale: 9387410,
                labelExpressionInfo: labelExpressionInfo,
                labelPlacement: labelPlacement,
                symbol: new symbols_1.TextSymbol(__assign({ font: {
                        size: 8,
                        family: "Noto Sans"
                    }, color: belowColor }, commonProperties))
            })
        ];
    }
});
//# sourceMappingURL=labels.js.map