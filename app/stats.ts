import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Legend = require("esri/widgets/Legend");
import univariateColorSize = require("esri/smartMapping/renderers/univariateColorSize");
import watchUtils = require("esri/core/watchUtils");
import WebStyleSymbol = require("esri/symbols/WebStyleSymbol");
import Slider = require("esri/widgets/Slider");
import Feature = require("esri/widgets/Feature");
import intl = require("esri/intl");
import FieldInfo = require("esri/popup/FieldInfo");
import colorSchemes = require("esri/smartMapping/symbology/color");
import Graphic = require("esri/Graphic");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import promiseUtils = require("esri/core/promiseUtils");
import { ClassBreaksRenderer, SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { Extent } from "esri/geometry";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";
import { createRenderer, updateRenderer } from "./renderers";

export async function queryStats(layerView:esri.FeatureLayerView, year:number): Promise<any> {
  const query = layerView.createQuery();
  const onStatisticField = createCumulativeSumField(year);

  query.outStatistics = [new StatisticDefinition({
    statisticType: "sum",
    onStatisticField: createCumulativeSumField(year),
    outStatisticFieldName: "total_accumulated_visitation"
  }), new StatisticDefinition({
    statisticType: "sum",
    onStatisticField: `F${year}`,
    outStatisticFieldName: "annual_visitation"
  }), new StatisticDefinition({
    statisticType: "sum",
    onStatisticField: year > 1904 ? `F${year-1}` : "F1904",
    outStatisticFieldName: "previous_annual_visitation"
  })];

  const response = await layerView.queryFeatures(query);
  const stats = response.features[0].attributes;
  return stats;
}

function createCumulativeSumField(year: number){
  let onStatisticField = "";
  for( let start = 1904; start < year; start++){
    onStatisticField += `F${start} + `;
  }
  onStatisticField += `F${year}`;
  return onStatisticField;
}