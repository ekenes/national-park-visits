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
define(["require", "exports", "esri/smartMapping/symbology/color", "esri/smartMapping/renderers/univariateColorSize", "esri/renderers/visualVariables/SizeVariable", "esri/Color", "esri/renderers/visualVariables/support/SizeStop", "esri/symbols/support/cimSymbolUtils", "esri/symbols", "esri/renderers", "./cimReference", "./expressions"], function (require, exports, colorSchemes, univariateRendererCreator, SizeVariable, Color, SizeStop, cimSymbolUtils_1, symbols_1, renderers_1, cimReference_1, expressions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderers = {};
    var RendererVars = /** @class */ (function () {
        function RendererVars() {
        }
        RendererVars.rendererType = null;
        return RendererVars;
    }());
    exports.RendererVars = RendererVars;
    function createPercentChangeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, year, previousYear, colorScheme, renderer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layer = params.layer, view = params.view, year = params.year;
                        previousYear = year - 1;
                        colorScheme = colorSchemes.getSchemeByName({
                            geometryType: "point",
                            name: "Green and Brown 1",
                            theme: "above-and-below"
                        });
                        return [4 /*yield*/, univariateRendererCreator.createContinuousRenderer({
                                layer: layer,
                                view: view,
                                theme: "above-and-below",
                                valueExpression: "$feature.F" + year + " - $feature.F" + previousYear,
                                valueExpressionTitle: "Total change in park visits (" + previousYear + " - " + year + ")",
                                defaultSymbolEnabled: false,
                                colorOptions: {
                                    colorScheme: colorScheme,
                                    isContinuous: false,
                                },
                                symbolOptions: {
                                    symbolStyle: "circle-arrow"
                                }
                            })];
                    case 1:
                        renderer = (_a.sent()).renderer;
                        return [2 /*return*/, renderer];
                }
            });
        });
    }
    function updatePercentChangeRenderer(params) {
        var year = params.year, renderer = params.renderer;
        var _a = expressions_1.updatePercentChangeValueExpression(year), valueExpression = _a.valueExpression, valueExpressionTitle = _a.valueExpressionTitle;
        renderer.valueExpression = valueExpression;
        renderer.valueExpressionTitle = valueExpressionTitle;
        renderer.visualVariables.forEach(function (visualVariable) {
            visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
            visualVariable.valueExpressionTitle = valueExpressionTitle;
        });
        return renderer;
    }
    function createTotalChangeRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var layer, view, year, _a, valueExpression, valueExpressionTitle, renderer, sizeVariable;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        layer = params.layer, view = params.view, year = params.year;
                        _a = expressions_1.updateTotalChangeValueExpression(year), valueExpression = _a.valueExpression, valueExpressionTitle = _a.valueExpressionTitle;
                        return [4 /*yield*/, univariateRendererCreator.createContinuousRenderer({
                                layer: layer,
                                view: view,
                                theme: "above-and-below",
                                valueExpression: valueExpression,
                                valueExpressionTitle: valueExpressionTitle,
                                defaultSymbolEnabled: false,
                                colorOptions: {
                                    colorScheme: colorScheme,
                                    isContinuous: false,
                                },
                                symbolOptions: {
                                    symbolStyle: "circle-arrow"
                                }
                            })];
                    case 1:
                        renderer = (_b.sent()).renderer;
                        renderer.classBreakInfos[0].maxValue = 0;
                        renderer.classBreakInfos[1].minValue = 0;
                        sizeVariable = renderer.visualVariables.filter(function (vv) { return vv.type === "size"; })[0];
                        ;
                        sizeVariable.stops = [
                            new SizeStop({ value: -2000000, size: 40 }),
                            new SizeStop({ value: -1000000, size: 24 }),
                            new SizeStop({ value: 0, size: 8 }),
                            new SizeStop({ value: 1000000, size: 24 }),
                            new SizeStop({ value: 2000000, size: 40 }),
                        ];
                        return [2 /*return*/, renderer];
                }
            });
        });
    }
    function updateTotalChangeRenderer(params) {
        var year = params.year, renderer = params.renderer;
        var _a = expressions_1.updateTotalChangeValueExpression(year), valueExpression = _a.valueExpression, valueExpressionTitle = _a.valueExpressionTitle;
        renderer.valueExpression = valueExpression;
        renderer.valueExpressionTitle = valueExpressionTitle;
        renderer.visualVariables.forEach(function (visualVariable) {
            visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
            visualVariable.valueExpressionTitle = valueExpressionTitle;
        });
        return renderer;
    }
    function createBivariateRenderer(year) {
        var colors = ["#a6611a", "#dfc27d", "#f0f0f0", "#80cdc1", "#018571"];
        var symbol = new symbols_1.CIMSymbol({
            data: cimReference_1.cimReference
        });
        cimSymbolUtils_1.applyCIMSymbolColor(symbol, new Color(colors[4]));
        return new renderers_1.ClassBreaksRenderer({
            field: "F" + year,
            classBreakInfos: [
                {
                    minValue: -9007199254740991,
                    maxValue: 9007199254740991,
                    symbol: symbol
                }
            ],
            visualVariables: [
                new SizeVariable({
                    field: "F" + year,
                    legendOptions: {
                        title: "Total park visits in " + year
                    },
                    stops: [
                        { value: 100000, size: "14px" },
                        { value: 1000000, size: "25px" },
                        { value: 4000000, size: "40px" },
                        { value: 10000000, size: "60px" }
                    ]
                })
            ]
        });
    }
    function createRenderer(params) {
        return __awaiter(this, void 0, void 0, function () {
            var year, type, renderer, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        year = params.year, type = params.type;
                        _a = type;
                        switch (_a) {
                            case "percent-change": return [3 /*break*/, 1];
                            case "total-change": return [3 /*break*/, 3];
                            case "bivariate": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 1: return [4 /*yield*/, createPercentChangeRenderer(params)];
                    case 2:
                        renderer = _b.sent();
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, createTotalChangeRenderer(params)];
                    case 4:
                        renderer = _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        renderer = createBivariateRenderer(year);
                        return [3 /*break*/, 7];
                    case 6:
                        renderer = new renderers_1.ClassBreaksRenderer({
                            defaultSymbol: new symbols_1.SimpleMarkerSymbol()
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, renderer];
                }
            });
        });
    }
    exports.createRenderer = createRenderer;
    function updateRenderer(params) {
        var year = params.year, type = params.type;
        var renderer;
        switch (type) {
            case "percent-change":
                renderer = updatePercentChangeRenderer(params);
                break;
            case "total-change":
                renderer = updateTotalChangeRenderer(params);
                break;
            case "bivariate":
                renderer = createBivariateRenderer(year);
                break;
            default:
                renderer = new renderers_1.ClassBreaksRenderer({
                    defaultSymbol: new symbols_1.SimpleMarkerSymbol()
                });
                break;
        }
        return renderer.clone();
    }
    exports.updateRenderer = updateRenderer;
});
//# sourceMappingURL=renderers.js.map