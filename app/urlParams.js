define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.getUrlParams = getUrlParams;
    // function to set an id as a url param
    function setUrlParams(viewType) {
        window.history.pushState("", "", window.location.pathname + "?viewType=" + viewType);
    }
    exports.setUrlParams = setUrlParams;
});
//# sourceMappingURL=urlParams.js.map