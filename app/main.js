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
define(["require", "exports", "./views", "./urlParams", "./widgets", "./viewUtils"], function (require, exports, views_1, urlParams_1, widgets_1, viewUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        function createAllViews(map) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _a = views_1.views.us;
                            return [4 /*yield*/, views_1.createUsView(views_1.views.us.container, map)
                                    .then(viewUtils_1.maintainFixedExtent)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 1:
                            _a.view = _e.sent();
                            _b = views_1.views.ak;
                            return [4 /*yield*/, views_1.createAkView(views_1.views.ak.container, map)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 2:
                            _b.view = _e.sent();
                            _c = views_1.views.hi;
                            return [4 /*yield*/, views_1.createHiView(views_1.views.hi.container, map)
                                    .then(viewUtils_1.disableNavigation)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 3:
                            _c.view = _e.sent();
                            _d = views_1.views.vi;
                            return [4 /*yield*/, views_1.createViView(views_1.views.vi.container, map)
                                    .then(viewUtils_1.disableNavigation)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 4:
                            _d.view = _e.sent();
                            return [2 /*return*/, views_1.views];
                    }
                });
            });
        }
        function renderViews(newValue) {
            return __awaiter(this, void 0, void 0, function () {
                var esriMap, _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            urlParams_1.setUrlParams(newValue);
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
                            return [4 /*yield*/, views_1.createUsView(views_1.views.us.container, esriMap)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 4:
                            _b.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 5:
                            _c = views_1.views.ak;
                            return [4 /*yield*/, views_1.createAkView(views_1.views.us.container, esriMap)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 6:
                            _c.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 7:
                            _d = views_1.views.hi;
                            return [4 /*yield*/, views_1.createHiView(views_1.views.us.container, esriMap)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 8:
                            _d.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 9:
                            _e = views_1.views.vi;
                            return [4 /*yield*/, views_1.createViView(views_1.views.us.container, esriMap)
                                    .then(viewUtils_1.enableHighlightOnPointerMove)];
                        case 10:
                            _e.view = _f.sent();
                            return [3 /*break*/, 12];
                        case 11: return [3 /*break*/, 12];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        }
        var viewSelect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    viewSelect = document.getElementById("viewSelect");
                    views_1.ViewVars.viewType = urlParams_1.getUrlParams();
                    if (viewUtils_1.isMobileBrowser()) {
                        views_1.ViewVars.viewType = views_1.ViewVars.viewType === "all" ? "us" : views_1.ViewVars.viewType;
                        widgets_1.disableSelectOptionByValue(viewSelect, "all");
                    }
                    urlParams_1.setUrlParams(views_1.ViewVars.viewType);
                    viewSelect.value = views_1.ViewVars.viewType;
                    viewSelect.addEventListener("change", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    views_1.ViewVars.viewType = viewSelect.value;
                                    return [4 /*yield*/, renderViews(views_1.ViewVars.viewType)];
                                case 1:
                                    _a.sent();
                                    widgets_1.udpateViewWidgets();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, renderViews(views_1.ViewVars.viewType)];
                case 1:
                    _a.sent();
                    widgets_1.udpateViewWidgets();
                    widgets_1.initializeSlider();
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=main.js.map