import esri = __esri;

import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import colorSchemes = require("esri/smartMapping/symbology/color");
import univariateRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import Color = require("esri/Color");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");
import { applyCIMSymbolColor } from "esri/symbols/support/cimSymbolUtils";

import { CIMSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { ClassBreaksRenderer } from "esri/renderers";
import { cimReference } from "./cimReference";
import { updatePercentChangeValueExpression, updateTotalChangeValueExpression } from "./expressions";
import { UrlParams } from "./urlParams";

const colorScheme = colorSchemes.getSchemeByName({
  geometryType: "point",
  name: "Green and Brown 1",
  theme: "above-and-below"
});

export const renderers = { };

export class RendererVars {
  public static rendererType: UrlParams["variable"] = null;
}

interface CreateRendererParams {
  layer: FeatureLayer;
  view: MapView;
  year: number;
  type?: UrlParams["variable"];
}

async function createPercentChangeRenderer(params: CreateRendererParams): Promise<ClassBreaksRenderer> {
  const { layer, view, year } = params;
  const previousYear = year - 1;

  const { renderer } = await univariateRendererCreator.createContinuousRenderer({
    layer,
    view,
    theme: "above-and-below",
    valueExpression: `$feature.F${year} - $feature.F${previousYear}`,
    valueExpressionTitle: `Total change in park visits (${previousYear} - ${year})`,
    defaultSymbolEnabled: false,
    colorOptions: {
      colorScheme,
      isContinuous: false,
    },
    symbolOptions: {
      symbolStyle: "circle-arrow"
    }
  });
  return renderer;
}

interface UpdateRendererParams {
  renderer: ClassBreaksRenderer;
  year: number;
  type?: "percent-change" | "total-change" | "bivariate";
}

function updatePercentChangeRenderer(params: UpdateRendererParams): ClassBreaksRenderer {
  const { year, renderer } = params;

  const { valueExpression, valueExpressionTitle } = updatePercentChangeValueExpression(year);

  renderer.valueExpression = valueExpression;
  renderer.valueExpressionTitle = valueExpressionTitle;

  renderer.visualVariables.forEach( visualVariable => {
    visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
    visualVariable.valueExpressionTitle = valueExpressionTitle;
  });

  return renderer;
}

async function createTotalChangeRenderer(params: CreateRendererParams) {
  const { layer, view, year } = params;
  const { valueExpression, valueExpressionTitle } = updateTotalChangeValueExpression(year);

  const { renderer } = await univariateRendererCreator.createContinuousRenderer({
    layer,
    view,
    theme: "above-and-below",
    valueExpression,
    valueExpressionTitle,
    defaultSymbolEnabled: false,
    colorOptions: {
      colorScheme,
      isContinuous: false,
    },
    symbolOptions: {
      symbolStyle: "circle-arrow"
    }
  });
  renderer.classBreakInfos[0].maxValue = 0;
  renderer.classBreakInfos[1].minValue = 0;
  const sizeVariable = renderer.visualVariables.filter( vv => vv.type === "size")[0] as esri.SizeVariable;;
  sizeVariable.stops = [
    new SizeStop({ value: -2000000, size: 40 }),
    new SizeStop({ value: -1000000, size: 24 }),
    new SizeStop({ value: 0, size: 8 }),
    new SizeStop({ value: 1000000, size: 24 }),
    new SizeStop({ value: 2000000, size: 40 }),
  ];

  return renderer;
}

function updateTotalChangeRenderer(params: UpdateRendererParams): ClassBreaksRenderer {
  const { year, renderer } = params;

  const { valueExpression, valueExpressionTitle } = updateTotalChangeValueExpression(year);

  renderer.valueExpression = valueExpression;
  renderer.valueExpressionTitle = valueExpressionTitle;

  renderer.visualVariables.forEach( visualVariable => {
    visualVariable.valueExpression = visualVariable.valueExpression !== "$view.scale" ? valueExpression : "$view.scale";
    visualVariable.valueExpressionTitle = valueExpressionTitle;
  });

  return renderer;
}

function createBivariateRenderer(year: number): ClassBreaksRenderer {
  const colors = [ "#a6611a", "#dfc27d", "#f0f0f0", "#80cdc1", "#018571" ];

  const symbol = new CIMSymbol({
    data: cimReference
  });

  applyCIMSymbolColor(symbol, new Color(colors[4]));

  return new ClassBreaksRenderer({
    field: `F${year}`,
    classBreakInfos: [
      {
        minValue: -9007199254740991,
        maxValue: 9007199254740991,
        symbol
      }
    ],
    visualVariables: [
      new SizeVariable({
        field: `F${year}`,
        legendOptions: {
          title: `Total park visits in ${year}`
        },
        stops: [
          { value: 100000, size: "14px" },
          { value: 1000000, size: "25px" },
          { value: 4000000, size: "40px" },
          { value: 10000000, size: "60px" }
        ]
      })
    ]
  });
}

export async function createRenderer(params: CreateRendererParams): Promise<ClassBreaksRenderer> {
  const {year, type } = params;

  let renderer: ClassBreaksRenderer;

  switch (type){
    case "percent-change":
      renderer = await createPercentChangeRenderer(params);
      break;
    case "total-change":
      renderer = await createTotalChangeRenderer(params);
      break;
    case "bivariate":
      renderer = createBivariateRenderer(year);
      break;
    default:
      renderer = new ClassBreaksRenderer({
        defaultSymbol: new SimpleMarkerSymbol()
      });
      break;
  }

  return renderer;
}

export function updateRenderer(params: UpdateRendererParams): ClassBreaksRenderer {
  const {year, type } = params;

  let renderer: ClassBreaksRenderer;

  switch (type){
    case "percent-change":
      renderer = updatePercentChangeRenderer(params);
      break;
    case "total-change":
      renderer = updateTotalChangeRenderer(params);
      break;
    case "bivariate":
      renderer = createBivariateRenderer(year);
      break;
    default:
      renderer = new ClassBreaksRenderer({
        defaultSymbol: new SimpleMarkerSymbol()
      });
      break;
  }

  return renderer.clone();
}