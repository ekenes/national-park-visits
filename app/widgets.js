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
define(["require", "exports", "esri/widgets/Legend", "esri/core/watchUtils", "esri/widgets/Slider", "esri/widgets/Feature", "esri/intl", "./popup", "./labels", "./renderers", "./stats", "./views"], function (require, exports, Legend, watchUtils, Slider, Feature, intl, popup_1, labels_1, renderers_1, stats_1, views_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Widgets = /** @class */ (function () {
        function Widgets() {
        }
        Widgets.featureWidget = null;
        return Widgets;
    }());
    exports.Widgets = Widgets;
    var legend;
    var yearElement = document.getElementById("year");
    var previousYearElement = document.getElementById("previous-year");
    var annualVisitsElement = document.getElementById("annual-visits");
    var percentChangeElement = document.getElementById("percent-change");
    var totalChangeElement = document.getElementById("total-change");
    function udpateViewWidgets() {
        var vType = views_1.ViewVars.viewType === "all" ? "us" : views_1.ViewVars.viewType;
        var view = views_1.views[vType].view;
        if (!Widgets.featureWidget) {
            Widgets.featureWidget = new Feature({
                container: document.getElementById("feature")
            });
        }
        Widgets.featureWidget.map = view.map;
        Widgets.featureWidget.spatialReference = view.spatialReference;
        if (!legend) {
            legend = new Legend({
                container: document.getElementById("legend")
            });
        }
        legend.view = view;
    }
    exports.udpateViewWidgets = udpateViewWidgets;
    exports.slider = new Slider({
        disabled: true,
        container: "timeSlider",
        min: 1905,
        max: 2020,
        values: [2020],
        steps: 1,
        layout: "vertical",
        visibleElements: {
            labels: false,
            rangeLabels: true
        },
        tickConfigs: [{
                mode: "position",
                values: [1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010],
                labelsVisible: true
            }]
    });
    function initializeSlider() {
        return __awaiter(this, void 0, void 0, function () {
            var vType, view, layerView;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        exports.year = exports.slider.values[0];
                        vType = views_1.ViewVars.viewType === "all" ? "us" : views_1.ViewVars.viewType;
                        view = views_1.views[vType].view;
                        yearElement.innerHTML = exports.year.toString();
                        previousYearElement.innerHTML = (exports.year - 1).toString();
                        return [4 /*yield*/, view.whenLayerView(views_1.layer)];
                    case 1:
                        layerView = _a.sent();
                        watchUtils.whenFalseOnce(layerView, "updating", function () { return __awaiter(_this, void 0, void 0, function () {
                            var stats, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, stats_1.queryStats(layerView, exports.year)];
                                    case 1:
                                        stats = _c.sent();
                                        updateParkVisitationDisplay(stats);
                                        _a = renderers_1.renderers;
                                        _b = renderers_1.rendererType;
                                        return [4 /*yield*/, renderers_1.createRenderer({
                                                layer: views_1.layer,
                                                view: view,
                                                year: exports.year,
                                                type: renderers_1.rendererType
                                            })];
                                    case 2:
                                        _a[_b] = _c.sent();
                                        views_1.layer.renderer = renderers_1.renderers[renderers_1.rendererType];
                                        views_1.layer.popupTemplate = popup_1.createPopupTemplate(exports.year);
                                        views_1.layer.labelingInfo = labels_1.createLabelingInfo(exports.year);
                                        exports.slider.disabled = false;
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        exports.slider.watch("values", function (_a) {
                            var value = _a[0];
                            return __awaiter(_this, void 0, void 0, function () {
                                var stats;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            exports.year = value;
                                            yearElement.innerHTML = exports.year.toString();
                                            previousYearElement.innerHTML = (exports.year - 1).toString();
                                            updateLayer(value);
                                            return [4 /*yield*/, stats_1.queryStats(layerView, exports.year)];
                                        case 1:
                                            stats = _b.sent();
                                            updateParkVisitationDisplay(stats);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.initializeSlider = initializeSlider;
    function updateLayer(year) {
        renderers_1.renderers[renderers_1.rendererType] = renderers_1.updateRenderer({
            renderer: views_1.layer.renderer,
            year: year,
            type: renderers_1.rendererType
        });
        views_1.layer.renderer = renderers_1.renderers[renderers_1.rendererType];
        views_1.layer.popupTemplate = popup_1.createPopupTemplate(year);
        views_1.layer.labelingInfo = labels_1.createLabelingInfo(year);
    }
    function updateParkVisitationDisplay(stats) {
        var annual = stats.annual_visitation;
        var total = stats.total_accumulated_visitation;
        var previous = stats.previous_annual_visitation || null;
        var change = annual - previous;
        var percentChange = ((annual - previous) / previous) * 100;
        // const increaseOrDecrease = percentChange > 0 ? "increase" : "decrease";
        var formattedChange = intl.formatNumber(Math.abs(change), {
            digitSeparator: true,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        });
        var formattedPercentChange = intl.formatNumber(Math.abs(percentChange), {
            digitSeparator: true,
            maximumFractionDigits: 1,
            minimumFractionDigits: 1
        });
        annualVisitsElement.innerText = intl.formatNumber(annual, {
            digitSeparator: true
        });
        if (previous) {
            if (percentChange > 0) {
                percentChangeElement.innerHTML = "<span class='increase-style'><b>+" + formattedPercentChange + "%</b></span>";
                totalChangeElement.innerHTML = "<span class='increase-style'><b>(\u2191" + formattedChange + ")</b></span>";
            }
            else {
                percentChangeElement.innerHTML = "<span class='decrease-style'><b>-" + formattedPercentChange + "%</b></span>";
                totalChangeElement.innerHTML = "<span class='decrease-style'><b>(\u2193" + formattedChange + ")</b></span>";
            }
        }
        else {
            percentChangeElement.innerHTML = null;
        }
    }
    function disableSelectOptionByValue(selectElement, value) {
        var op = selectElement.getElementsByTagName("option");
        for (var i = 0; i < op.length; i++) {
            (op[i].value.toLowerCase() == value.toLowerCase())
                ? op[i].disabled = true
                : op[i].disabled = false;
        }
    }
    exports.disableSelectOptionByValue = disableSelectOptionByValue;
    function enableSelectOptionsAll(selectElement) {
        var op = selectElement.getElementsByTagName("option");
        for (var i = 0; i < op.length; i++) {
            op[i].disabled = false;
        }
    }
    exports.enableSelectOptionsAll = enableSelectOptionsAll;
});
//# sourceMappingURL=widgets.js.map