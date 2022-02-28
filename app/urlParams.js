define(["require", "exports", "./viewUtils"], function (require, exports, viewUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUrlParams() {
        var queryParams = document.location.search.substr(1);
        var result = {};
        var isMobile = viewUtils_1.isMobileBrowser();
        queryParams.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        if (!result.viewType) {
            result.viewType = "all";
        }
        if (isMobile) {
            if (result.viewType === "all") {
                result.viewType = "us";
            }
        }
        result = {
            viewType: result.viewType,
            variable: result.variable || "percent-change",
            year: parseInt(result.year) || 2021
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