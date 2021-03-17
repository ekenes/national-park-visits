import esri = __esri;
import LabelClass = require("esri/layers/support/LabelClass")
import { TextSymbol } from "esri/symbols";
import { RendererVars } from "./renderers";

const aboveColor = "#018571";
const belowColor = "#a6611a";
const haloColor = "#f7ebd6";
const haloSize = 1;
const commonProperties = {
  xoffset: -8,
  yoffset: -8,
  horizontalAlignment: "left",
  haloColor,
  haloSize
} as esri.TextSymbolProperties;

const labelExpressionInfo = {
  expression: "Replace($feature.Park, 'National Park', '')"
};
const labelPlacement = "above-right";
const deconflictionStrategy = "static";

export function createLabelingInfo(year: number): LabelClass[] {
  if(RendererVars.rendererType === "bivariate"){
    return createBasicLabelingInfo(year);
  }
  return createChangeLabelingInfo(year);
}

function createBasicLabelingInfo(year: number): LabelClass[] {
  return [
    new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 3000000`,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 12,
          family: "Noto Sans",
          weight: "bold"
        },
        color: aboveColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 1000000 AND F${year} < 3000000`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 9,
          family: "Noto Sans",
          weight: "bold"
        },
        color: aboveColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} < 1000000`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 8,
          family: "Noto Sans"
        },
        color: aboveColor,
        ...commonProperties
      })
    })
  ];
}

function createChangeLabelingInfo(year: number): LabelClass[] {
  const previousYear = year - 1;
  const aboveWhere = `AND (F${year} >= F${previousYear})`;
  const belowWhere = `AND (F${year} < F${previousYear})`;
  return [
    // above
    new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 3000000 ${aboveWhere}`,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 12,
          family: "Noto Sans",
          weight: "bold"
        },
        color: aboveColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 1000000 AND F${year} < 3000000 ${aboveWhere}`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 9,
          family: "Noto Sans",
          weight: "bold"
        },
        color: aboveColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} < 1000000 ${aboveWhere}`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 8,
          family: "Noto Sans"
        },
        color: aboveColor,
        ...commonProperties
      })
    }),

    // below

    new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 3000000 ${belowWhere}`,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 12,
          family: "Noto Sans",
          weight: "bold"
        },
        color: belowColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} >= 1000000 AND F${year} < 3000000 ${belowWhere}`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 9,
          family: "Noto Sans",
          weight: "bold"
        },
        color: belowColor,
        ...commonProperties
      })
    }), new LabelClass({
      deconflictionStrategy,
      where: `F${year} < 1000000 ${belowWhere}`,
      // minScale: 9387410,
      labelExpressionInfo,
      labelPlacement,
      symbol: new TextSymbol({
        font: {
          size: 8,
          family: "Noto Sans"
        },
        color: belowColor,
        ...commonProperties
      })
    })
  ];
}