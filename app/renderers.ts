import esri = __esri;

import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import colorSchemes = require("esri/smartMapping/symbology/color");
import univariateRendererCreator = require("esri/smartMapping/renderers/univariateColorSize");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");
import SizeStop = require("esri/renderers/visualVariables/support/SizeStop");

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
  const { valueExpression, valueExpressionTitle } = updatePercentChangeValueExpression(year);

  let rendererParams = {
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
  } as esri.univariateColorSizeCreateContinuousRendererParams;

  const { renderer } = await univariateRendererCreator.createContinuousRenderer(rendererParams);
  renderer.classBreakInfos[0].maxValue = 0;
  renderer.classBreakInfos[1].minValue = 0;
  const sizeVariable = renderer.visualVariables.filter( vv => vv.type === "size")[0] as esri.SizeVariable;
  sizeVariable.stops = [
    new SizeStop({ value: -100, size: 40 }),
    new SizeStop({ value: -50, size: 24 }),
    new SizeStop({ value: 0, size: 12 }),
    new SizeStop({ value: 50, size: 24 }),
    new SizeStop({ value: 100, size: 40 })
  ];

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

  const rendererParams = {
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
  } as esri.univariateColorSizeCreateContinuousRendererParams;

  const { renderer } = await univariateRendererCreator.createContinuousRenderer(rendererParams);
  const sizeVariable = renderer.visualVariables.filter( vv => vv.type === "size")[0] as esri.SizeVariable;;
  sizeVariable.stops = [
    new SizeStop({ value: -500000, size: 40 }),
    new SizeStop({ value: -250000, size: 24 }),
    new SizeStop({ value: 0, size: 12 }),
    new SizeStop({ value: 250000, size: 24 }),
    new SizeStop({ value: 500000, size: 40 })
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
      }), new ColorVariable({
        valueExpression: `
          var current = DefaultValue($feature.F${year}, 1);
          var previous = 0;
          if(${year} > 1905){
            previous = DefaultValue($feature.F${year - 1}, 1)
          }
          var val = ((current - previous) / previous) * 100;
          return val;
        `,
        valueExpressionTitle: "% Change from previous year",
        stops: [
          { value: -10, color: colors[0], label: "Fewer visits" },
          { value: -0.1, color: colors[1] },
          { value: 0, color: colors[2], label: "No change" },
          { value: 0.1, color: colors[3] },
          { value: 10, color: colors[4], label: "More visits" }
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