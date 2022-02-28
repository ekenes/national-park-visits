define(["require", "exports", "esri/popup/FieldInfo", "esri/PopupTemplate", "./expressions", "./widgets"], function (require, exports, FieldInfo, PopupTemplate, expressions_1, widgets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function disablePopupOnClick(view) {
        view.on("click", function (event) {
            event.stopPropagation();
        });
        return view;
    }
    exports.disablePopupOnClick = disablePopupOnClick;
    var fieldsForChart = [];
    var fieldInfos = [];
    function createFieldsForChart() {
        var start = 1905;
        var end = widgets_1.endYear;
        fieldsForChart = [];
        fieldInfos = [];
        for (var y = start; y <= end; y++) {
            fieldsForChart.push("F" + y);
            fieldInfos.push(new FieldInfo({
                fieldName: "F" + y,
                label: y.toString(),
                format: {
                    places: 0,
                    digitSeparator: true
                }
            }));
        }
    }
    function createPopupTemplate(year) {
        if (fieldsForChart.length < 1) {
            createFieldsForChart();
        }
        return new PopupTemplate({
            title: "{Park}",
            outFields: ["*"],
            expressionInfos: [{
                    name: "max",
                    title: "Highest growth",
                    expression: expressions_1.highestGrowthArcade
                }, {
                    name: "min",
                    title: "Lowest growth",
                    expression: expressions_1.lowestGrowthArcade
                }, {
                    name: "record",
                    title: "Year with most visits",
                    expression: expressions_1.recordVisitsArcade
                }, {
                    name: "growth",
                    title: "Change from " + (year - 1) + " - " + year,
                    expression: "\n        var popCurrent = $feature.F" + year + ";\n        var popPrevious = IIF(" + year + " == 1904, 0, $feature.F" + (year - 1) + ");\n        var change = popCurrent - popPrevious;\n        IIF(change > 0, \"+\", \"\") + Text(change, \"#,###\");\n      "
                }, {
                    name: "percent-growth",
                    title: "% growth from " + (year - 1) + " - " + year,
                    expression: "\n        var popCurrent = $feature.F" + year + ";\n        var popPrevious = IIF(" + year + " == 1904, 0, $feature.F" + (year - 1) + ");\n        var perChange = ((popCurrent - popPrevious) / popPrevious) * 100;\n        var direction = IIF(perChange < 0, \"decrease\", \"increase\");\n        return Text(Abs(perChange), '#,###.0') + \"% \" + direction;\n      "
                }],
            fieldInfos: fieldInfos,
            content: [{
                    type: "text",
                    text: "\n        <b>{F" + year + "}</b> people visited {Park} in " + year + ", a <b>{expression/percent-growth}</b> from the previous year.\n      "
                }, {
                    type: "fields",
                    fieldInfos: [{
                            fieldName: "expression/growth"
                        }, {
                            fieldName: "expression/max"
                        }, {
                            fieldName: "expression/min"
                        }, {
                            fieldName: "expression/record"
                        }, {
                            fieldName: "TOTAL",
                            label: "Total visits (1904-2019)",
                            format: {
                                places: 0,
                                digitSeparator: true
                            }
                        }]
                }, {
                    type: "media",
                    title: "Annual park visits (1905-" + widgets_1.endYear + ")",
                    mediaInfos: [{
                            type: "line-chart",
                            value: {
                                fields: fieldsForChart
                            }
                        }]
                }]
        });
    }
    exports.createPopupTemplate = createPopupTemplate;
});
//# sourceMappingURL=popup.js.map