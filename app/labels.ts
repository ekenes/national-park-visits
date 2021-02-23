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
import LabelClass = require("esri/layers/support/LabelClass")
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol, TextSymbol } from "esri/symbols";
import { Extent } from "esri/geometry";
import { createPopupTemplate } from "./popup";

export function createLabelingInfo(year: number): LabelClass[] {
  const color = "#ae9a73";
  const haloColor = "#f7ebd6";
  const haloSize = 0;

  return [new LabelClass({
    where: `F${year} >= 3000000`,
    labelExpressionInfo: {
      expression: "Replace($feature.Park, 'National Park', '')"
    },
    labelPlacement: "above-right",
    symbol: new TextSymbol({
      font: {
        size: 12,
        family: "Noto Sans",
        weight: "bold"
      },
      xoffset: -8,
      yoffset: -8,
      horizontalAlignment: "left",
      color,
      haloColor,
      haloSize

    })
  }), new LabelClass({
    where: `F${year} >= 1000000 AND F${year} < 3000000`,
    // minScale: 9387410,
    labelExpressionInfo: {
      expression: "Replace($feature.Park, 'National Park', '')"
    },
    labelPlacement: "above-right",
    symbol: new TextSymbol({
      font: {
        size: 9,
        family: "Noto Sans",
        weight: "bold"
      },
      xoffset: -8,
      yoffset: -8,
      horizontalAlignment: "left",
      color,
      haloColor,
      haloSize

    })
  }), new LabelClass({
    where: `F${year} < 1000000`,
    // minScale: 9387410,
    labelExpressionInfo: {
      expression: "Replace($feature.Park, 'National Park', '')"
    },
    labelPlacement: "above-right",
    symbol: new TextSymbol({
      font: {
        size: 8,
        family: "Noto Sans"
      },
      xoffset: -8,
      yoffset: -8,
      horizontalAlignment: "left",
      color,
      haloColor,
      haloSize
    })
  })];
}