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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers", "esri/symbols", "esri/geometry", "./renderers", "./labels", "./popup", "./widgets", "esri/geometry/support/jsonUtils"], function (require, exports, WebMap, MapView, FeatureLayer, renderers_1, symbols_1, geometry_1, renderers_2, labels_1, popup_1, widgets_1, jsonUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewVars = /** @class */ (function () {
        function ViewVars() {
        }
        ViewVars.viewType = null;
        return ViewVars;
    }());
    exports.ViewVars = ViewVars;
    exports.views = {
        ak: {
            container: document.getElementById("akViewDiv"),
            view: null
        },
        hi: {
            container: document.getElementById("hiViewDiv"),
            view: null
        },
        vi: {
            container: document.getElementById("viViewDiv"),
            view: null
        },
        us: {
            container: document.getElementById("mainViewDiv"),
            view: null
        }
    };
    exports.layer = null;
    function createLayer() {
        var layer = new FeatureLayer({
            title: "U.S. National Parks",
            portalItem: {
                id: "0e3fd5de259f46acb169c54eb501cfe5"
            },
            renderer: renderers_2.renderers[renderers_2.RendererVars.rendererType] ? renderers_2.renderers[renderers_2.RendererVars.rendererType] : new renderers_1.SimpleRenderer({
                symbol: new symbols_1.SimpleMarkerSymbol({
                    color: [255, 0, 0, 0],
                    outline: null
                })
            }),
            labelsVisible: true,
            labelingInfo: renderers_2.renderers[renderers_2.RendererVars.rendererType] ? labels_1.createLabelingInfo(widgets_1.year) : null,
            popupTemplate: renderers_2.renderers[renderers_2.RendererVars.rendererType] ? popup_1.createPopupTemplate(widgets_1.year) : null,
            outFields: ["*"],
            layerId: 0,
            minScale: 0,
            maxScale: 0,
            popupEnabled: false
        });
        return layer;
    }
    exports.createLayer = createLayer;
    function createMap() {
        exports.layer = createLayer();
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
                ]
            },
            layers: [exports.layer]
        });
    }
    exports.createMap = createMap;
    function createUsView(params) {
        return __awaiter(this, void 0, void 0, function () {
            var container, map, isMobile, isInset, mobileScale, desktopScale, scale, center, mobileConstraints, desktopConstraints, constraints, usView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = params.container, map = params.map, isMobile = params.isMobile, isInset = params.isInset;
                        container.style.display = "flex";
                        mobileScale = 36353220;
                        desktopScale = 16723716;
                        scale = isMobile ? mobileScale : desktopScale;
                        center = jsonUtils_1.fromJSON({ "spatialReference": { "wkid": 5070 }, "x": -7456.301870036883, "y": 1666581.490601381 });
                        mobileConstraints = {
                            rotationEnabled: false,
                            minScale: mobileScale,
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
                        };
                        desktopConstraints = {
                            rotationEnabled: false,
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
                        };
                        constraints = isMobile ? mobileConstraints : desktopConstraints;
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
                            center: center,
                            scale: scale,
                            constraints: constraints,
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
    exports.createUsView = createUsView;
    function createAkView(params) {
        return __awaiter(this, void 0, void 0, function () {
            var container, map, isMobile, isInset, mobileScale, desktopScale, insetScale, scale, insetCenter, fullCenter, center, mobileConstraints, desktopConstraints, constraints, akView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = params.container, map = params.map, isMobile = params.isMobile, isInset = params.isInset;
                        container.style.display = "flex";
                        mobileScale = 24510951;
                        desktopScale = 13076340;
                        insetScale = 40436349;
                        scale = isInset ? insetScale : isMobile ? mobileScale : desktopScale;
                        insetCenter = jsonUtils_1.fromJSON({ "spatialReference": { "wkid": 5936 }, "x": 2103194.674427798, "y": -957221.1614695506 });
                        fullCenter = jsonUtils_1.fromJSON({ "spatialReference": { "wkid": 5936 }, "x": 1811978.2456641502, "y": -1043832.0433061125 });
                        center = isInset ? insetCenter : fullCenter;
                        mobileConstraints = {
                            rotationEnabled: false,
                            minScale: isInset ? insetScale : mobileScale,
                            maxScale: 5893891,
                            geometry: new geometry_1.Extent({
                                spatialReference: {
                                    wkid: 5936
                                },
                                xmin: 737823.0703569443,
                                ymin: -2103604.250401656,
                                xmax: 3689660.4504700145,
                                ymax: 110273.7846831464
                            })
                        };
                        desktopConstraints = {
                            rotationEnabled: false,
                            minScale: desktopScale,
                            maxScale: 4338033,
                            geometry: new geometry_1.Extent({
                                spatialReference: {
                                    wkid: 5936
                                },
                                xmin: 737823.0703569443,
                                ymin: -2103604.250401656,
                                xmax: 3689660.4504700145,
                                ymax: 110273.7846831464
                            })
                        };
                        constraints = isInset || isMobile ? mobileConstraints : desktopConstraints;
                        akView = new MapView({
                            map: map,
                            container: container,
                            center: center,
                            scale: scale,
                            constraints: constraints,
                            spatialReference: {
                                // WGS_1984_EPSG_Alaska_Polar_Stereographic
                                wkid: 5936
                            },
                            ui: {
                                components: !isInset ? ["attribution"] : []
                            }
                        });
                        return [4 /*yield*/, akView.when()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    exports.createAkView = createAkView;
    function createHiView(params) {
        var container = params.container, map = params.map, isMobile = params.isMobile, isInset = params.isInset;
        container.style.display = "flex";
        var mobileScale = 5728779;
        var desktopScale = 2416226;
        var insetScale = 16833054;
        var scale = isInset ? insetScale : isMobile ? mobileScale : desktopScale;
        var insetCenter = jsonUtils_1.fromJSON({ "spatialReference": { "wkid": 102007 }, "x": 143836.25219758786, "y": 869819.4196612639 });
        var fullCenter = jsonUtils_1.fromJSON({ "spatialReference": { "wkid": 102007 }, "x": -4804.986580757636, "y": 856852.2343004141 });
        var center = isInset ? insetCenter : fullCenter;
        var mobileConstraints = {
            rotationEnabled: false,
            minScale: isInset ? insetScale : 10099832,
            maxScale: 2874526,
            geometry: new geometry_1.Extent({
                spatialReference: {
                    wkid: 102007
                },
                xmin: -390787.1649959057,
                ymin: 564313.6231185358,
                xmax: 756460.4545479296,
                ymax: 1183827.3376722068
            })
        };
        var desktopConstraints = {
            rotationEnabled: false,
            minScale: 1315641,
            maxScale: 4766466,
            geometry: new geometry_1.Extent({
                spatialReference: {
                    wkid: 102007
                },
                xmin: -390787.1649959057,
                ymin: 564313.6231185358,
                xmax: 756460.4545479296,
                ymax: 1183827.3376722068
            })
        };
        var constraints = isInset || isMobile ? mobileConstraints : desktopConstraints;
        var hiView = new MapView({
            map: map,
            container: container,
            center: center,
            scale: scale,
            constraints: constraints,
            spatialReference: {
                // Hawaii_Albers_Equal_Area_Conic
                wkid: 102007
            },
            ui: {
                components: !isInset ? ["attribution"] : []
            }
        });
        return hiView.when();
    }
    exports.createHiView = createHiView;
    function createViView(params) {
        return __awaiter(this, void 0, void 0, function () {
            var container, map, isMobile, isInset, viView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = params.container, map = params.map, isMobile = params.isMobile, isInset = params.isInset;
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
                                rotationEnabled: false,
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
                                components: !isInset ? ["attribution"] : []
                            }
                        });
                        return [4 /*yield*/, viView.when()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    exports.createViView = createViView;
    function destroyView(view, key) {
        if (view) {
            view.map.removeAll();
            view.container.style.display = "none";
            view.container = null;
            view.map = null;
            exports.views[key].view = null;
        }
    }
    function destroyAllViews() {
        for (var k in exports.views) {
            var view = exports.views[k].view;
            destroyView(view, k);
        }
    }
    exports.destroyAllViews = destroyAllViews;
});
//# sourceMappingURL=views.js.map