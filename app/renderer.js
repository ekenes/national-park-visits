var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/smartMapping/symbology/color", "esri/smartMapping/renderers/univariateColorSize", "esri/renderers/visualVariables/support/SizeStop"], function (require, exports, colorSchemes, univariateRendererCreator, SizeStop) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // update the layer's renderer each time the user changes a parameter
    function updateRenderer(params) {
        var year = params.year, layer = params.layer;
        var renderer = layer.renderer.clone();
        var previousYear = year - 1;
        var valueExpression = "(($feature.F" + year + " - $feature.F" + previousYear + ") / $feature.F" + previousYear + ") * 100";
        var valueExpressionTitle = "% Change in park visits (" + previousYear + " - " + year + ")";
        renderer.valueExpression = valueExpression;
        renderer.valueExpressionTitle = valueExpressionTitle;
        renderer.visualVariables.forEach(function (visualVariable) {
            visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
            visualVariable.valueExpressionTitle = valueExpressionTitle;
        });
        layer.renderer = renderer;
    }
    exports.updateRenderer = updateRenderer;
    function createRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, year, previousYear, valueExpression, valueExpressionTitle, colorScheme, rendererParams, renderer, sizeVariable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, year = params.year;
                        previousYear = year - 1;
                        valueExpression = "(($feature.F" + year + " - $feature.F" + previousYear + ") / $feature.F" + previousYear + ") * 100";
                        valueExpressionTitle = "% Change in park visitation (" + previousYear + " - " + year + ")";
                        colorScheme = colorSchemes.getSchemeByName({
                            geometryType: layer.geometryType,
                            name: "Green and Brown 1",
                            theme: "above-and-below"
                        });
                        rendererParams = {
                            layer: layer,
                            view: view,
                            theme: "above-and-below",
                            valueExpression: valueExpression,
                            valueExpressionTitle: valueExpressionTitle,
                            minValue: -200,
                            maxValue: 200,
                            defaultSymbolEnabled: false,
                            colorOptions: {
                                colorScheme: colorScheme,
                                isContinuous: false,
                            },
                            symbolOptions: {
                                symbolStyle: "circle-arrow"
                            }
                        };
                        return [4 /*yield*/, univariateRendererCreator.createContinuousRenderer(rendererParams)];
                    case 1:
                        renderer = (_a.sent()).renderer;
                        sizeVariable = renderer.visualVariables.filter(function (vv) { return vv.type === "size"; })[0];
                        sizeVariable.stops = [
                            new SizeStop({ value: -100, size: 40 }),
                            new SizeStop({ value: -50, size: 24 }),
                            new SizeStop({ value: 0, size: 12 }),
                            new SizeStop({ value: 50, size: 24 }),
                            new SizeStop({ value: 100, size: 40 })
                        ];
                        renderer.authoringInfo.statistics = {
                            min: -100,
                            max: 100
                        };
                        layer.renderer = renderer;
                        return [2 /*return*/, renderer];
                }
            });
        });
    }
    exports.createRenderer = createRenderer;
});
//# sourceMappingURL=renderer.js.map