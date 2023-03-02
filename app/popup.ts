import MapView = require("esri/views/MapView");
import FieldInfo = require("esri/popup/FieldInfo");
import PopupTemplate = require("esri/PopupTemplate");
import { highestGrowthArcade, lowestGrowthArcade, recordVisitsArcade } from "./expressions";
import { endYear } from "./widgets";

export function disablePopupOnClick(view: MapView) {
  view.on("click", function (event) {
    event.stopPropagation();
  });
  return view;
}

let fieldsForChart: string[] = [];
let fieldInfos: FieldInfo[] = [];

function createFieldsForChart (){
  const start = 1905;
  const end = endYear;
  fieldsForChart = [];
  fieldInfos = [];

  for (let y=start; y <= end; y++){
    fieldsForChart.push(`F${y}`);
    fieldInfos.push(new FieldInfo({
      fieldName: `F${y}`,
      label: y.toString(),
      format: {
        places: 0,
        digitSeparator: true
      }
    }));
  }
}

export function createPopupTemplate(year: number): PopupTemplate {
  if(fieldsForChart.length < 1){
    createFieldsForChart();
  }
  return new PopupTemplate({
    title: "{Park}",
    outFields: ["*"],
    expressionInfos: [{
      name: "max",
      title: "Highest growth",
      expression: highestGrowthArcade
    }, {
      name: "min",
      title: "Lowest growth",
      expression: lowestGrowthArcade
    }, {
      name: "record",
      title: "Year with most visits",
      expression: recordVisitsArcade
    }, {
      name: "growth",
      title: `Change from ${year-1} - ${year}`,
      expression: `
        var popCurrent = $feature.F${year};
        var popPrevious = IIF(${year} == 1904, 0, $feature.F${year - 1});
        var change = popCurrent - popPrevious;
        IIF(change > 0, "+", "") + Text(change, "#,###");
      `
    }, {
      name: "percent-growth",
      title: `% growth from ${year-1} - ${year}`,
      expression: `
        var popCurrent = $feature.F${year};
        var popPrevious = IIF(${year} == 1904, 0, $feature.F${year - 1});
        var perChange = ((popCurrent - popPrevious) / popPrevious) * 100;
        var direction = IIF(perChange < 0, "decrease", "increase");
        return Text(Abs(perChange), '#,###.0') + "% " + direction;
      `
    }, {
      name: "total",
      title: `Total visits (1904 - ${endYear})`,
      expression: `
        var s = 1904;
        var e = ${endYear};
        var total = 0;
        for (var y = s; y <= e; y++){
          total += $feature["F" + y];
        }
        return Text(total, "#,###");
      `
    }],
    fieldInfos: fieldInfos,
    content: [{
      type: "text",
      text: `
        <b>{F${year}}</b> people visited {Park} in ${year}, a <b>{expression/percent-growth}</b> from the previous year.
      `
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
        fieldName: "expression/total"
      }]
    }, {
      type: "media",
      title: `Annual park visits (1905-${endYear})`,
      mediaInfos: [{
        type: "line-chart",
        value: {
          fields: fieldsForChart
        }
      }]
    }]
  });
}