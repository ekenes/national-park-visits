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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/core/watchUtils", "esri/widgets/Slider", "esri/widgets/Feature", "esri/intl", "esri/tasks/support/StatisticDefinition", "esri/renderers", "esri/symbols", "esri/geometry", "./popup", "./labels", "./renderer"], function (require, exports, WebMap, MapView, FeatureLayer, Legend, watchUtils, Slider, Feature, intl, StatisticDefinition, renderers_1, symbols_1, geometry_1, popup_1, labels_1, renderer_1) {
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
            return;
        }
        // function to set an id as a url param
        function setUrlParams(viewType) {
            window.history.pushState("", "", window.location.pathname + "?viewType=" + viewType);
        }
        function createLayer() {
            return new FeatureLayer({
                title: "U.S. National Parks",
                portalItem: {
                    id: "0e3fd5de259f46acb169c54eb501cfe5"
                },
                renderer: new renderers_1.SimpleRenderer({
                    symbol: new symbols_1.SimpleMarkerSymbol({
                        color: [255, 0, 0, 1],
                        outline: null
                    })
                }),
                outFields: ["*"],
                layerId: 0,
                minScale: 0,
                maxScale: 0,
                popupEnabled: false
            });
        }
        function createMap() {
            layer = createLayer();
            return new WebMap({
                basemap: {
                    baseLayers: [
                        new FeatureLayer({
                            popupEnabled: false,
                            portalItem: {
                                id: "99fd67933e754a1181cc755146be21ca"
                            },
                            minScale: 0,
                            maxScale: 0,
                            renderer: new renderers_1.SimpleRenderer({
                                symbol: new symbols_1.SimpleFillSymbol({
                                    color: "#f7ebd6",
                                    outline: {
                                        style: "solid",
                                        width: 1,
                                        color: "#dcd8d0"
                                    }
                                })
                            }),
                            effect: "grayscale(0.3) drop-shadow(0px 7px 20px gray)"
                        }),
                        new FeatureLayer({
                            popupEnabled: false,
                            portalItem: {
                                id: "f092c20803a047cba81fbf1e30eff0b5"
                            },
                            minScale: 0,
                            maxScale: 0,
                            definitionExpression: "NAME LIKE '%NP%' OR NAME LIKE '%National Park%'",
                            effect: "grayscale(0.3) opacity(0.55) drop-shadow(2px 2px 10px green)"
                        })
                    ]
                },
                layers: [layer]
            });
        }
        function createUsView(container, map) {
            return __awaiter(this, void 0, void 0, function () {
                var usView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            container.style.display = "flex";
                            usView = new MapView({
                                map: map,
                                container: container,
                                popup: {
                                    highlightEnabled: true,
                                    dockEnabled: true,
                                    dockOptions: {
                                        breakpoint: false,
                                        position: "top-right"
                                    }
                                },
                                extent: {
                                    spatialReference: {
                                        wkid: 5070
                                    },
                                    xmin: -2985714.7547551794,
                                    ymin: 66403.41816565767,
                                    xmax: 2965420.009085534,
                                    ymax: 3244802.8703926024
                                },
                                constraints: {
                                    minScale: 16215262,
                                    maxScale: 2000000,
                                    geometry: new geometry_1.Extent({
                                        spatialReference: {
                                            wkid: 5070
                                        },
                                        xmin: -1921286.8554006994,
                                        ymin: 726332.1394147258,
                                        xmax: 1694697.29902421,
                                        ymax: 2715123.424348426
                                    })
                                },
                                spatialReference: {
                                    // NAD_1983_Contiguous_USA_Albers
                                    wkid: 5070
                                },
                                ui: {
                                    components: ["attribution"]
                                }
                            });
                            return [4 /*yield*/, usView.when()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        function createAkView(container, map) {
            return __awaiter(this, void 0, void 0, function () {
                var akView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            container.style.display = "flex";
                            akView = new MapView({
                                map: map,
                                container: container,
                                extent: new geometry_1.Extent({
                                    spatialReference: {
                                        wkid: 5936
                                    },
                                    xmin: 737823.0703569443,
                                    ymin: -2103604.250401656,
                                    xmax: 3689660.4504700145,
                                    ymax: 110273.7846831464
                                }),
                                spatialReference: {
                                    // WGS_1984_EPSG_Alaska_Polar_Stereographic
                                    wkid: 5936
                                },
                                constraints: {
                                    minScale: 36810426,
                                    maxScale: 12400323,
                                    geometry: new geometry_1.Extent({
                                        spatialReference: {
                                            wkid: 5936
                                        },
                                        xmin: 737823.0703569443,
                                        ymin: -2103604.250401656,
                                        xmax: 3689660.4504700145,
                                        ymax: 110273.7846831464
                                    })
                                },
                                ui: {
                                    components: []
                                }
                            });
                            return [4 /*yield*/, akView.when()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        function createHiView(container, map) {
            container.style.display = "flex";
            var hiView = new MapView({
                map: map,
                container: container,
                extent: new geometry_1.Extent({
                    spatialReference: {
                        wkid: 102007
                    },
                    xmin: -390787.1649959057,
                    ymin: 564313.6231185358,
                    xmax: 756460.4545479296,
                    ymax: 1183827.3376722068
                }),
                spatialReference: {
                    // Hawaii_Albers_Equal_Area_Conic
                    wkid: 102007
                },
                constraints: {
                    minScale: 17344181,
                    geometry: new geometry_1.Extent({
                        spatialReference: {
                            wkid: 102007
                        },
                        xmin: -390787.1649959057,
                        ymin: 564313.6231185358,
                        xmax: 756460.4545479296,
                        ymax: 1183827.3376722068
                    })
                },
                ui: {
                    components: []
                }
            });
            return hiView.when();
        }
        function createViView(container, map) {
            return __awaiter(this, void 0, void 0, function () {
                var viView;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            container.style.display = "flex";
                            viView = new MapView({
                                map: map,
                                container: container,
                                extent: {
                                    spatialReference: {
                                        wkid: 5070
                                    },
                                    xmin: 3368052.0840510447,
                                    ymin: 56364.032814495884,
                                    xmax: 3369766.5874800514,
                                    ymax: 58078.53624350274
                                },
                                spatialReference: {
                                    wkid: 5070
                                },
                                constraints: {
                                    minScale: 43200,
                                    maxScale: 43200,
                                    geometry: new geometry_1.Extent({
                                        spatialReference: {
                                            wkid: 5070
                                        },
                                        xmin: 3368052.0840510447,
                                        ymin: 56364.032814495884,
                                        xmax: 3369766.5874800514,
                                        ymax: 58078.53624350274
                                    })
                                },
                                ui: {
                                    components: []
                                }
                            });
                            return [4 /*yield*/, viView.when()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        function createAllViews(map) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = views.us;
                            return [4 /*yield*/, createUsView(views.us.container, map)];
                        case 1:
                            _a.view = _e.sent();
                            _b = views.ak;
                            return [4 /*yield*/, createAkView(views.ak.container, map)];
                        case 2:
                            _b.view = _e.sent();
                            _c = views.hi;
                            return [4 /*yield*/, createHiView(views.hi.container, map)];
                        case 3:
                            _c.view = _e.sent();
                            _d = views.vi;
                            return [4 /*yield*/, createViView(views.vi.container, map)];
                        case 4:
                            _d.view = _e.sent();
                            return [2 /*return*/, views];
                    }
                });
            });
        }
        function destroyView(view, key) {
            if (view) {
                view.map.removeAll();
                view.container.style.display = "none";
                view.container = null;
                view.map = null;
                views[key].view = null;
            }
        }
        function destroyAllViews() {
            for (var k in views) {
                var view = views[k].view;
                destroyView(view, k);
            }
        }
        function initializeSlider() {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            year = slider.values[0];
                            yearElement.innerHTML = year.toString();
                            previousYearElement.innerHTML = (year - 1).toString();
                            return [4 /*yield*/, views.us.view.whenLayerView(layer)];
                        case 1:
                            layerView = _a.sent();
                            watchUtils.whenFalseOnce(layerView, "updating", function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, queryStats(layerView, year)
                                                .then(updateParkVisitationDisplay)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, renderer_1.createRenderer({
                                                    layer: layer,
                                                    view: views.us.view,
                                                    year: year
                                                })];
                                        case 2:
                                            _a.sent();
                                            layer.popupTemplate = popup_1.createPopupTemplate(year);
                                            layer.labelingInfo = labels_1.createLabelingInfo(year);
                                            slider.disabled = false;
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            slider.watch("values", function (_a) {
                                var value = _a[0];
                                yearElement.innerHTML = value;
                                previousYearElement.innerHTML = (value - 1).toString();
                                renderer_1.updateRenderer({
                                    layer: layer,
                                    year: value
                                });
                                layer.popupTemplate = popup_1.createPopupTemplate(value);
                                layer.labelingInfo = labels_1.createLabelingInfo(value);
                                queryStats(layerView, value)
                                    .then(updateParkVisitationDisplay);
                            });
                            return [2 /*return*/, views.us.view];
                    }
                });
            });
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
                        case 0: return [4 /*yield*/, view.whenLayerView(layer)];
                        case 1:
                            layerView = _a.sent();
                            view.on("pointer-move", function (event) { return __awaiter(_this, void 0, void 0, function () {
                                var response, id, feature, selectionId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, view.hitTest(event, {
                                                include: layer
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
                            return [2 /*return*/];
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
        function queryStats(layerView, year) {
            return __awaiter(this, void 0, void 0, function () {
                var query, onStatisticField, response, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = layerView.createQuery();
                            onStatisticField = createCumulativeSumField(year);
                            query.outStatistics = [new StatisticDefinition({
                                    statisticType: "sum",
                                    onStatisticField: createCumulativeSumField(year),
                                    outStatisticFieldName: "total_accumulated_visitation"
                                }), new StatisticDefinition({
                                    statisticType: "sum",
                                    onStatisticField: "F" + year,
                                    outStatisticFieldName: "annual_visitation"
                                }), new StatisticDefinition({
                                    statisticType: "sum",
                                    onStatisticField: year > 1904 ? "F" + (year - 1) : "F1904",
                                    outStatisticFieldName: "previous_annual_visitation"
                                })];
                            return [4 /*yield*/, layerView.queryFeatures(query)];
                        case 1:
                            response = _a.sent();
                            stats = response.features[0].attributes;
                            return [2 /*return*/, stats];
                    }
                });
            });
        }
        function createCumulativeSumField(year) {
            var onStatisticField = "";
            for (var start = 1904; start < year; start++) {
                onStatisticField += "F" + start + " + ";
            }
            onStatisticField += "F" + year;
            return onStatisticField;
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
                var esriMap, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            setUrlParams(newValue);
                            destroyAllViews();
                            esriMap = createMap();
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
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 3: return [4 /*yield*/, createUsView(views.us.container, esriMap)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 5: return [4 /*yield*/, createAkView(views.us.container, esriMap)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 7: return [4 /*yield*/, createHiView(views.us.container, esriMap)];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 9: return [4 /*yield*/, createViView(views.us.container, esriMap)];
                        case 10:
                            _b.sent();
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
        var views, yearElement, previousYearElement, annualVisitsElement, percentChangeElement, totalChangeElement, layer, legend, viewType, selectedView, year, layerView, featureWidget, slider, highlight, lastHighlight, viewSelect;
        return __generator(this, function (_a) {
            views = {
                ak: {
                    container: document.getElementById("akViewDiv"),
                    view: null //createAkView()
                },
                hi: {
                    container: document.getElementById("hiViewDiv"),
                    view: null //createHiView()
                },
                vi: {
                    container: document.getElementById("viViewDiv"),
                    view: null //createViView()
                },
                us: {
                    container: document.getElementById("mainViewDiv"),
                    view: null //createUsView()
                }
            };
            yearElement = document.getElementById("year");
            previousYearElement = document.getElementById("previous-year");
            annualVisitsElement = document.getElementById("annual-visits");
            percentChangeElement = document.getElementById("percent-change");
            totalChangeElement = document.getElementById("total-change");
            layer = null;
            legend = new Legend({
                view: views.us.view,
                container: document.getElementById("legend")
            });
            viewType = getUrlParams();
            if (!viewType) {
                viewType = isMobileBrowser() ? "us" : "all";
                setUrlParams(viewType);
            }
            selectedView = null;
            renderViews(viewType);
            year = 0;
            featureWidget = new Feature({
                // map: views.us.view.map,
                // spatialReference: views.us.view.spatialReference,
                container: document.getElementById("feature")
            });
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
            highlight = null;
            lastHighlight = null;
            viewSelect = document.getElementById("viewSelect");
            viewSelect.addEventListener("change", function () {
                var newValue = viewSelect.value;
                renderViews(newValue);
            });
            ;
            return [2 /*return*/];
        });
    }); })();
});
//# sourceMappingURL=main.js.map