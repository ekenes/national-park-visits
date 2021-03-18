define(["require", "exports", "./widgets"], function (require, exports, widgets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUrlParams() {
        var queryParams = document.location.search.substr(1);
        var result = {};
        queryParams.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        result = {
            viewType: result.viewType || "all",
            variable: result.variable || "percent-change",
            year: parseInt(result.year) || widgets_1.endYear
        };
        setUrlParams(result);
        return result;
    }
    exports.getUrlParams = getUrlParams;
    // function to set an id as a url param
    function setUrlParams(params) {
        var viewType = params.viewType, variable = params.variable, year = params.year;
        window.history.pushState("", "", window.location.pathname + "?viewType=" + viewType + "&variable=" + variable + "&year=" + year);
    }
    exports.setUrlParams = setUrlParams;
    function updateUrlParams(params) {
        var urlParams = getUrlParams();
        for (var p in params) {
            urlParams[p] = params[p];
        }
        ;
        setUrlParams(urlParams);
    }
    exports.updateUrlParams = updateUrlParams;
});
//# sourceMappingURL=urlParams.js.map