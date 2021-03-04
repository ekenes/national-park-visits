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
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function getUrlParams() {
            var queryParams = document.location.search.substr(1);
            var result = {};
            queryParams.split("&").forEach(function (part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });
            if (result && result.viewType) {
                return result.viewType;
            }
            return "all";
        }
        // function to set an id as a url param
        function setUrlParams(viewType) {
            window.history.pushState("", "", window.location.pathname + "?viewType=" + viewType);
        }
        function createAllViews(map) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = views_1.views.us;
                            return [4 /*yield*/, views_1.createUsView(views_1.views.us.container, map)
                                    .then(maintainFixedExtent)
                                    .then(enableHighlightOnPointerMove)];
                        case 1:
                            _a.view = _e.sent();
                            _b = views_1.views.ak;
                            return [4 /*yield*/, views_1.createAkView(views_1.views.ak.container, map)
                                    .then(enableHighlightOnPointerMove)];
                        case 2:
                            _b.view = _e.sent();
                            _c = views_1.views.hi;
                            return [4 /*yield*/, views_1.createHiView(views_1.views.hi.container, map)
                                    .then(disableNavigation)
                                    .then(enableHighlightOnPointerMove)];
                        case 3:
                            _c.view = _e.sent();
                            _d = views_1.views.vi;
                            return [4 /*yield*/, views_1.createViView(views_1.views.vi.container, map)
                                    .then(disableNavigation)
                                    .then(enableHighlightOnPointerMove)];
                        case 4:
                            _d.view = _e.sent();
                            return [2 /*return*/, views_1.views];
                    }
                });
            });
        }
        function disableSelectOptionByValue(selectElement, value) {
            var op = selectElement.getElementsByTagName("option");
            for (var i = 0; i < op.length; i++) {
                (op[i].value.toLowerCase() == value.toLowerCase())
                    ? op[i].disabled = true
                    : op[i].disabled = false;
            }
        }
        function enableSelectOptionsAll(selectElement) {
            var op = selectElement.getElementsByTagName("option");
            for (var i = 0; i < op.length; i++) {
                op[i].disabled = false;
            }
        }
        function udpateViewWidgets() {
            var vType = viewType === "all" ? "us" : viewType;
            var view = views_1.views[vType].view;
            if (!featureWidget) {
                featureWidget = new Feature({
                    container: document.getElementById("feature")
                });
            }
            featureWidget.map = view.map;
            featureWidget.spatialReference = view.spatialReference;
            if (!legend) {
                legend = new Legend({
                    container: document.getElementById("legend")
                });
            }
            legend.view = view;
        }
        function initializeSlider() {
            return __awaiter(this, void 0, void 0, function () {
                var year, vType, view;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            year = slider.values[0];
                            vType = viewType === "all" ? "us" : viewType;
                            view = views_1.views[vType].view;
                            yearElement.innerHTML = year.toString();
                            previousYearElement.innerHTML = (year - 1).toString();
                            return [4 /*yield*/, view.whenLayerView(views_1.layer)];
                        case 1:
                            layerView = _a.sent();
                            watchUtils.whenFalseOnce(layerView, "updating", function () { return __awaiter(_this, void 0, void 0, function () {
                                var stats, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, stats_1.queryStats(layerView, year)];
                                        case 1:
                                            stats = _c.sent();
                                            updateParkVisitationDisplay(stats);
                                            _a = renderers_1.renderers;
                                            _b = renderers_1.rendererType;
                                            return [4 /*yield*/, renderers_1.createRenderer({
                                                    layer: views_1.layer,
                                                    view: view,
                                                    year: year,
                                                    type: renderers_1.rendererType
                                                })];
                                        case 2:
                                            _a[_b] = _c.sent();
                                            views_1.layer.renderer = renderers_1.renderers[renderers_1.rendererType];
                                            views_1.layer.popupTemplate = popup_1.createPopupTemplate(year);
                                            views_1.layer.labelingInfo = labels_1.createLabelingInfo(year);
                                            slider.disabled = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            slider.watch("values", function (_a) {
                                var value = _a[0];
                                return __awaiter(_this, void 0, void 0, function () {
                                    var stats;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                yearElement.innerHTML = value;
                                                previousYearElement.innerHTML = (value - 1).toString();
                                                updateLayer(value);
                                                return [4 /*yield*/, stats_1.queryStats(layerView, value)];
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
        function maintainFixedExtent(view) {
            var fixedExtent = view.extent.clone();
            // keep a fixed extent in the view
            // when the view size changes
            view.on("resize", function () {
                view.extent = fixedExtent;
            });
            return view;
        }
        function enableHighlightOnPointerMove(view) {
            return __awaiter(this, void 0, void 0, function () {
                var layerView;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.whenLayerView(views_1.layer)];
                        case 1:
                            layerView = _a.sent();
                            view.on("pointer-move", function (event) { return __awaiter(_this, void 0, void 0, function () {
                                var response, id, feature, selectionId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, view.hitTest(event, {
                                                include: views_1.layer
                                            })];
                                        case 1:
                                            response = _a.sent();
                                            lastHighlight = highlight;
                                            id = null;
                                            if (response && response.results.length) {
                                                feature = response.results[0].graphic;
                                                // feature.popupTemplate = layer.popupTemplate;
                                                id = feature.getObjectId();
                                                highlight = layerView.highlight([id]);
                                                selectionId = featureWidget.graphic
                                                    ? featureWidget.graphic.getObjectId()
                                                    : null;
                                                if (highlight && id !== selectionId) {
                                                    featureWidget.graphic = feature;
                                                    featureWidget.container.style.display = "block";
                                                }
                                            }
                                            else {
                                                if (featureWidget.graphic) {
                                                    featureWidget.graphic = null;
                                                    featureWidget.container.style.display = "none";
                                                }
                                            }
                                            // remove the previous highlight
                                            if (lastHighlight) {
                                                lastHighlight.remove();
                                                lastHighlight = null;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/, view];
                    }
                });
            });
        }
        // disables all navigation in the view
        function disableNavigation(view) {
            view.popup.dockEnabled = true;
            // Removes the zoom action on the popup
            view.popup.actions = null;
            // stops propagation of default behavior when an event fires
            function stopEvtPropagation(event) {
                event.stopPropagation();
            }
            // disable mouse wheel scroll zooming on the view
            view.navigation.mouseWheelZoomEnabled = false;
            // disable zooming via double-click on the view
            view.on("double-click", stopEvtPropagation);
            // disable zooming out via double-click + Control on the view
            view.on("double-click", ["Control"], stopEvtPropagation);
            // disables pinch-zoom and panning on the view
            view.navigation.browserTouchPanEnabled = false;
            view.on("drag", stopEvtPropagation);
            // disable the view's zoom box to prevent the Shift + drag
            // and Shift + Control + drag zoom gestures.
            view.on("drag", ["Shift"], stopEvtPropagation);
            view.on("drag", ["Shift", "Control"], stopEvtPropagation);
            // prevents zooming and rotation with the indicated keys
            view.on("key-down", function (event) {
                var prohibitedKeys = ["+", "-", "_", "=", "a", "d"];
                var keyPressed = event.key.toLowerCase();
                if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                    event.stopPropagation();
                }
            });
            return view;
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
        function renderViews(newValue) {
            return __awaiter(this, void 0, void 0, function () {
                var esriMap, _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            setUrlParams(newValue);
                            views_1.destroyAllViews();
                            esriMap = views_1.createMap();
                            _a = newValue;
                            switch (_a) {
                                case "all": return [3 /*break*/, 1];
                                case "us": return [3 /*break*/, 3];
                                case "ak": return [3 /*break*/, 5];
                                case "hi": return [3 /*break*/, 7];
                                case "vi": return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 11];
                        case 1: return [4 /*yield*/, createAllViews(esriMap)];
                        case 2:
                            _f.sent();
                            return [3 /*break*/, 12];
                        case 3:
                            _b = views_1.views.us;
                            return [4 /*yield*/, views_1.createUsView(views_1.views.us.container, esriMap)];
                        case 4:
                            _b.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 5:
                            _c = views_1.views.ak;
                            return [4 /*yield*/, views_1.createAkView(views_1.views.us.container, esriMap)];
                        case 6:
                            _c.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 7:
                            _d = views_1.views.hi;
                            return [4 /*yield*/, views_1.createHiView(views_1.views.us.container, esriMap)];
                        case 8:
                            _d.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 9:
                            _e = views_1.views.vi;
                            return [4 /*yield*/, views_1.createViView(views_1.views.us.container, esriMap)];
                        case 10:
                            _e.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 11: return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
        function isMobileBrowser() {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        }
        var viewSelect, yearElement, previousYearElement, annualVisitsElement, percentChangeElement, totalChangeElement, viewType, layerView, featureWidget, legend, slider, highlight, lastHighlight;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    viewSelect = document.getElementById("viewSelect");
                    yearElement = document.getElementById("year");
                    previousYearElement = document.getElementById("previous-year");
                    annualVisitsElement = document.getElementById("annual-visits");
                    percentChangeElement = document.getElementById("percent-change");
                    totalChangeElement = document.getElementById("total-change");
                    viewType = getUrlParams();
                    if (isMobileBrowser()) {
                        viewType = viewType === "all" ? "us" : viewType;
                        disableSelectOptionByValue(viewSelect, "all");
                    }
                    setUrlParams(viewType);
                    viewSelect.value = viewType;
                    viewSelect.addEventListener("change", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    viewType = viewSelect.value;
                                    return [4 /*yield*/, renderViews(viewType)];
                                case 1:
                                    _a.sent();
                                    udpateViewWidgets();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, renderViews(viewType)];
                case 1:
                    _a.sent();
                    udpateViewWidgets();
                    slider = new Slider({
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
                    initializeSlider();
                    highlight = null;
                    lastHighlight = null;
                    ;
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map