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
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers", "esri/symbols", "esri/geometry", "./renderers"], function (require, exports, WebMap, MapView, FeatureLayer, renderers_1, symbols_1, geometry_1, renderers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            renderer: renderers_2.renderers[renderers_2.rendererType] ? renderers_2.renderers[renderers_2.rendererType] : new renderers_1.SimpleRenderer({
                symbol: new symbols_1.SimpleMarkerSymbol({
                    color: [255, 0, 0, 0],
                    outline: null
                })
            }),
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
            layers: [exports.layer]
        });
    }
    exports.createMap = createMap;
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
    exports.createUsView = createUsView;
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
    exports.createAkView = createAkView;
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
    exports.createHiView = createHiView;
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