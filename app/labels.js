define(["require", "exports", "esri/layers/support/LabelClass", "esri/symbols"], function (require, exports, LabelClass, symbols_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createLabelingInfo(year) {
        var color = "#ae9a73";
        var haloColor = "#f7ebd6";
        var haloSize = 0;
        return [new LabelClass({
                deconflictionStrategy: "static",
                where: "F" + year + " >= 3000000",
                labelExpressionInfo: {
                    expression: "Replace($feature.Park, 'National Park', '')"
                },
                labelPlacement: "above-right",
                symbol: new symbols_1.TextSymbol({
                    font: {
                        size: 12,
                        family: "Noto Sans",
                        weight: "bold"
                    },
                    xoffset: -8,
                    yoffset: -8,
                    horizontalAlignment: "left",
                    color: color,
                    haloColor: haloColor,
                    haloSize: haloSize
                })
            }), new LabelClass({
                deconflictionStrategy: "static",
                where: "F" + year + " >= 1000000 AND F" + year + " < 3000000",
                // minScale: 9387410,
                labelExpressionInfo: {
                    expression: "Replace($feature.Park, 'National Park', '')"
                },
                labelPlacement: "above-right",
                symbol: new symbols_1.TextSymbol({
                    font: {
                        size: 9,
                        family: "Noto Sans",
                        weight: "bold"
                    },
                    xoffset: -8,
                    yoffset: -8,
                    horizontalAlignment: "left",
                    color: color,
                    haloColor: haloColor,
                    haloSize: haloSize
                })
            }), new LabelClass({
                deconflictionStrategy: "static",
                where: "F" + year + " < 1000000",
                // minScale: 9387410,
                labelExpressionInfo: {
                    expression: "Replace($feature.Park, 'National Park', '')"
                },
                labelPlacement: "above-right",
                symbol: new symbols_1.TextSymbol({
                    font: {
                        size: 8,
                        family: "Noto Sans"
                    },
                    xoffset: -8,
                    yoffset: -8,
                    horizontalAlignment: "left",
                    color: color,
                    haloColor: haloColor,
                    haloSize: haloSize
                })
            })];
    }
    exports.createLabelingInfo = createLabelingInfo;
});
//# sourceMappingURL=labels.js.map