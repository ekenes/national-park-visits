import MapView = require("esri/views/MapView");
import FieldInfo = require("esri/popup/FieldInfo");
import PopupTemplate = require("esri/PopupTemplate");
import { highestGrowthArcade, lowestGrowthArcade } from "./expressions";

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
  const end = 2020;
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
      title: "Highest growth year",
      expression: highestGrowthArcade
    }, {
      name: "min",
      title: "Lowest growth year",
      expression: lowestGrowthArcade
    }, {
      name: "growth",
      title: `Change from ${year-1} - ${year}`,
      expression: `
        var popCurrent = $feature.F${year};
        var popPrevious = IIF(${year} == 1904, 0, $feature.F${year - 1});
        popCurrent - popPrevious;
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
        fieldName: "expression/growth",
        format: {
          places: 0,
          digitSeparator: true
        }
      }, {
        fieldName: "expression/max"
      }, {
        fieldName: "expression/min"
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
      mediaInfos: [{
        type: "line-chart",
        title: "Park visitation (1905-2019)",
        value: {
          fields: fieldsForChart
        }
      }]
    }]
  });
}