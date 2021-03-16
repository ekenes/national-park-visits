import LabelClass = require("esri/layers/support/LabelClass")
import { TextSymbol } from "esri/symbols";

export function createLabelingInfo(year: number): LabelClass[] {
  const color = "#ae9a73";
  const haloColor = "#f7ebd6";
  const haloSize = 0;

  return [new LabelClass({
    deconflictionStrategy: "static",
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
    deconflictionStrategy: "static",
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
    deconflictionStrategy: "static",
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