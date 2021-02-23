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
import univariateRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { Extent } from "esri/geometry";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";
import { ClassBreaksRenderer } from "esri/rasterRenderers";

interface UpdateRendererParams {
  layer: FeatureLayer,
  year: number
}

 // update the layer's renderer each time the user changes a parameter
 export function updateRenderer(params: UpdateRendererParams) {
  const { year, layer } = params;
  const renderer = (layer.renderer as esri.ClassBreaksRenderer).clone();
  const previousYear = year - 1;
  const valueExpression = `(($feature.F${year} - $feature.F${previousYear}) / $feature.F${previousYear}) * 100`;
  const valueExpressionTitle = `% Change in park visits (${previousYear} - ${year})`;

  renderer.valueExpression = valueExpression;
  renderer.valueExpressionTitle = valueExpressionTitle;

  renderer.visualVariables.forEach( visualVariable => {
    visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
    visualVariable.valueExpressionTitle = valueExpressionTitle;
  });

  layer.renderer = renderer;
}


interface CreateRendererParams {
  layer: FeatureLayer,
  view: MapView,
  year: number
}

export async function createRenderer(params: CreateRendererParams): Promise<ClassBreaksRenderer> {

  const { layer, view, year } = params;

  const previousYear = year - 1;
  const valueExpression = `(($feature.F${year} - $feature.F${previousYear}) / $feature.F${previousYear}) * 100`;
  const valueExpressionTitle = `% Change in park visitation (${previousYear} - ${year})`;

  const colorScheme = colorSchemes.getSchemeByName({
    geometryType: layer.geometryType,
    name: "Green and Brown 1",
    theme: "above-and-below"
  });

  let rendererParams = {
    layer,
    view,
    theme: "above-and-below",
    valueExpression,
    valueExpressionTitle,
    minValue: -200,
    maxValue: 200,
    defaultSymbolEnabled: false,
    colorOptions: {
      colorScheme,
      isContinuous: false,
    },
    symbolOptions: {
      symbolStyle: "circle-arrow"
    }
  } as esri.univariateColorSizeCreateContinuousRendererParams;

  const { renderer } = await univariateRendererCreator.createContinuousRenderer(rendererParams);
  const sizeVariable = renderer.visualVariables.filter( vv => vv.type === "size")[0] as esri.SizeVariable;
  sizeVariable.stops = [
    new SizeStop({ value: -100, size: 40 }),
    new SizeStop({ value: -50, size: 24 }),
    new SizeStop({ value: 0, size: 12 }),
    new SizeStop({ value: 50, size: 24 }),
    new SizeStop({ value: 100, size: 40 })
  ]

  renderer.authoringInfo.statistics = {
    min: -100,
    max: 100
  };
  layer.renderer = renderer;
  return renderer;
}