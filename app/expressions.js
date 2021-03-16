define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.highestGrowthArcade = "\n  var highest = -Infinity;\n  var previousValue = null;\n  var value = null;\n  var highestYear = null;\n  for (var att in $feature){\n    if( typeof($feature[att]) == 'Number' && Find('F', att) > -1){\n      if(Find('F_1904', att) == -1){\n        value = $feature[att] - previousValue;\n        if(value > highest){\n          highest = value;\n          highestYear = Mid(att, 1,4);\n        }\n        previousValue = $feature[att];\n      } else {\n        previousValue = $feature[att];\n      }\n    }\n  }\n  return highestYear + \" (\" + Text(highest, \"#,###\") + \")\";\n";
    exports.lowestGrowthArcade = "\n  var lowest = Infinity;\n  var previousValue = null;\n  var value = null;\n  var lowestYear = null;\n  for (var att in $feature){\n    var value = $feature[att];\n    if( typeof(value) == 'Number' && Find('F', att) > -1){\n      if(Find('F1904', att) == -1){\n        value = $feature[att] - previousValue;\n        if(value < lowest){\n          lowest = value;\n          lowestYear = Mid(att, 1,4);\n        }\n\n        previousValue = $feature[att];\n      } else {\n        previousValue = $feature[att];\n      }\n    }\n  }\n  return lowestYear + \" (\" + Text(lowest, \"#,###\") + \")\";\n";
    exports.visitationChangeArcade = "\n  var lowest = Infinity;\n  var ignoreFields = [ \"OBJECTID\", \"x\", \"y\", \"Range\" ];\n  for (var att in $feature){\n    var value = $feature[att];\n    if( typeof(value) == 'Number' && IndexOf(ignoreFields, att) == -1){\n      lowest = IIF(value < lowest, value, lowest);\n    }\n  }\n  return lowest;\n";
    function updatePercentChangeValueExpression(year) {
        var previousYear = year - 1;
        var valueExpression = "(($feature.F" + year + " - $feature.F" + previousYear + ") / $feature.F" + previousYear + ") * 100";
        var valueExpressionTitle = "% Change in park visitation (" + previousYear + " - " + year + ")";
        return { valueExpression: valueExpression, valueExpressionTitle: valueExpressionTitle };
    }
    exports.updatePercentChangeValueExpression = updatePercentChangeValueExpression;
    function updateTotalChangeValueExpression(year) {
        var previousYear = year - 1;
        var valueExpression = "\n    if(IsEmpty($feature.F" + year + ") || IsEmpty($feature.F" + previousYear + ")){\n      return null;\n    }\n    $feature.F" + year + " - $feature.F" + previousYear + "\n  ";
        var valueExpressionTitle = "Total change in park visits (" + previousYear + " - " + year + ")";
        return { valueExpression: valueExpression, valueExpressionTitle: valueExpressionTitle };
    }
    exports.updateTotalChangeValueExpression = updateTotalChangeValueExpression;
});
//# sourceMappingURL=expressions.js.map