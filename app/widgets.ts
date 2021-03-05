import Legend = require("esri/widgets/Legend");
import watchUtils = require("esri/core/watchUtils");
import Slider = require("esri/widgets/Slider");
import Feature = require("esri/widgets/Feature");
import intl = require("esri/intl");
import Graphic = require("esri/Graphic");

import { ClassBreaksRenderer } from "esri/renderers";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";
import { createRenderer, updateRenderer, renderers, rendererType } from "./renderers";
import { queryStats } from "./stats";
import { layer, views, ViewVars } from "./views";
import { UrlParams } from "./urlParams";

export class Widgets {
  public static featureWidget: Feature = null;
}

let legend: Legend;
export let year: number = 2020;

export const yearElement = document.getElementById("year") as HTMLSpanElement;
export const previousYearElement = document.getElementById("previous-year") as HTMLSpanElement;

const annualVisitsElement = document.getElementById("annual-visits") as HTMLSpanElement;
const percentChangeElement = document.getElementById("percent-change") as HTMLSpanElement;
const totalChangeElement = document.getElementById("total-change") as HTMLSpanElement;

export function updateViewWidgets(){
  const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
  const view = views[vType].view;

  if(!Widgets.featureWidget){
    Widgets.featureWidget = new Feature({
      container: document.getElementById("feature")
    });
  }
  Widgets.featureWidget.map = view.map;
  Widgets.featureWidget.spatialReference = view.spatialReference;

  if(!legend){
    legend = new Legend({
      container: document.getElementById("legend")
    });
  }
  legend.view = view;
}


export async function initializeSlider() {
  const slider = new Slider({
    container: "timeSlider",
    min: 1905,
    max: year,
    values: [ year ],
    steps: 1,
    layout: "vertical",
    visibleElements: {
      labels: false,
      rangeLabels: true
    },
    tickConfigs: [{
      mode: "position",
      values: [ 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010 ],
      labelsVisible: true
    }]
  });

  const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
  const view = views[vType].view;

  const layerView = await view.whenLayerView(layer);

  slider.watch("values", async ([ value ]) => {
    year = value;
    yearElement.innerHTML = year.toString();
    previousYearElement.innerHTML = (year - 1).toString();

    updateLayer(value);

    const stats = await queryStats(layerView, year);
    updateParkVisitationDisplay(stats);
  });
}

function updateLayer(year: number){
  renderers[rendererType] = updateRenderer({
    renderer: layer.renderer as ClassBreaksRenderer,
    year,
    type: rendererType
  });

  layer.renderer = renderers[rendererType];
  layer.popupTemplate = createPopupTemplate(year);
  layer.labelingInfo = createLabelingInfo(year);
}

export function updateParkVisitationDisplay(stats: Graphic["attributes"]){
  const annual = stats.annual_visitation;
  const total = stats.total_accumulated_visitation;
  const previous = stats.previous_annual_visitation || null;
  const change = annual - previous;
  const percentChange = ( (annual - previous) / previous) * 100;
  // const increaseOrDecrease = percentChange > 0 ? "increase" : "decrease";
  const formattedChange = intl.formatNumber(Math.abs(change), {
    digitSeparator: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  } as any);

  const formattedPercentChange = intl.formatNumber(Math.abs(percentChange), {
    digitSeparator: true,
    maximumFractionDigits: 1,
    minimumFractionDigits: 1
  } as any);

  annualVisitsElement.innerText = intl.formatNumber(annual, {
    digitSeparator: true
  } as any);

  if(previous){
    if(percentChange > 0){
      percentChangeElement.innerHTML = `<span class='increase-style'><b>+${formattedPercentChange}%</b></span>`;
      totalChangeElement.innerHTML = `<span class='increase-style'><b>(↑${formattedChange})</b></span>`;
    } else {
      percentChangeElement.innerHTML = `<span class='decrease-style'><b>-${formattedPercentChange}%</b></span>`;
      totalChangeElement.innerHTML = `<span class='decrease-style'><b>(↓${formattedChange})</b></span>`;
    }
  } else {
    percentChangeElement.innerHTML = null;
  }
}

export function disableSelectOptionByValue(selectElement: HTMLSelectElement, value: string){
  const op = selectElement.getElementsByTagName("option");
  for (var i = 0; i < op.length; i++) {
    (op[i].value.toLowerCase() == value.toLowerCase())
      ? op[i].disabled = true
      : op[i].disabled = false;
  }
}

export function enableSelectOptionsAll(selectElement: HTMLSelectElement){
  const op = selectElement.getElementsByTagName("option");
  for (var i = 0; i < op.length; i++) {
    op[i].disabled = false;
  }
}