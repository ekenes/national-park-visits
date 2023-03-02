import Legend = require("esri/widgets/Legend");
import Slider = require("esri/widgets/Slider");
import Feature = require("esri/widgets/Feature");
import intl = require("esri/intl");
import Graphic = require("esri/Graphic");
import Expand = require("esri/widgets/Expand");

import { ClassBreaksRenderer } from "esri/renderers";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";
import { updateRenderer, renderers, RendererVars } from "./renderers";
import { queryStats } from "./stats";
import { layer, views, ViewVars } from "./views";
import { highlight } from "./viewUtils";
import { getUrlParams, updateUrlParams, UrlParams } from "./urlParams";

export class Widgets {
  public static featureWidget: Feature = null;
}

const uiElements = document.getElementById("title") as HTMLDivElement;
let legend: Legend = null;

export let { year } = getUrlParams();
export const endYear = 2022;

export const yearElement = document.getElementById("year") as HTMLSpanElement;
export const previousYearElement = document.getElementById("previous-year") as HTMLSpanElement;

yearElement.innerHTML = year.toString();
previousYearElement.innerHTML = (year-1).toString();

const annualVisitsElement = document.getElementById("annual-visits") as HTMLSpanElement;
const percentChangeElement = document.getElementById("percent-change") as HTMLSpanElement;
const totalChangeElement = document.getElementById("total-change") as HTMLSpanElement;

export function updateViewWidgets(isMobile?: boolean){
  const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
  const view = views[vType].view;

  // Feature widget

  if(!Widgets.featureWidget){
    Widgets.featureWidget = new Feature({
      container: document.getElementById("feature")
    });
    document.getElementById("feature-close").addEventListener("click", ()=>{
      (Widgets.featureWidget.container as HTMLElement).style.display = "none";
      Widgets.featureWidget.graphic = null;
      if (highlight) {
        highlight.remove();
      }
    });
  }
  Widgets.featureWidget.map = view.map;
  Widgets.featureWidget.spatialReference = view.spatialReference;

  // UI controls

  const uiControls = new Expand({
    view,
    content: uiElements,
    expanded: true,
    expandIconClass: "esri-icon-sliders-horizontal",
    group: isMobile ? "mobile" : null,
    // container: document.createElement("div")
  });
  // (uiControls.content as HTMLElement).style.maxHeight = "85%";
  // (uiControls.content as HTMLElement).style.overflow = "auto";
  view.ui.add(uiControls, "top-right");

  // Legend

  if(legend){
    legend.container = null;
    legend.destroy();
    legend = null;
  }
  legend = new Legend({
    view,
    container: document.createElement("div")
  });
  (legend.container as HTMLElement).classList.add("legend");
  (legend.container as HTMLElement).style.width = "200px";
  (legend.container as HTMLElement).style.overflow = "auto";
  // legendContainer.appendChild(legend.container as HTMLElement);
  view.ui.add(new Expand({
    view,
    expanded: !isMobile,
    content: legend.container,
    group: isMobile ? "mobile" : null,
    expandIconClass: "esri-icon-legend"
  }), "bottom-right");
}


export async function initializeSlider() {
  const slider = new Slider({
    container: "timeSlider",
    min: 1905,
    max: endYear,
    values: [ year ],
    steps: 1,
    layout: "horizontal",
    visibleElements: {
      labels: false,
      rangeLabels: false
    },
    tickConfigs: [{
      mode: "position",
      values: [ 1905, 1918, 1942, 1960, 1980, 2000, 2020 ],
      labelFormatFunction: (value, type) => {
        const labels = {
          1918: "Flu",
          1942: "WWII"
        };
        if(type === "tick"){
          if(labels[value]){
            return labels[value];
          }
        }
        return value;
      },
      tickCreatedFunction: (value, tickElement, labelElement) => {
        const setValue = () => {
          slider.values = [ value ];
        };
        tickElement.addEventListener("click", setValue);
        tickElement.style.cursor = "pointer";
        labelElement.addEventListener("click", setValue);
        labelElement.style.cursor = "pointer";
      },
      labelsVisible: true
    }]
  });
  (slider.container as HTMLElement).style.display = "flex";

  slider.watch("values", async ([ value ]) => {
    year = value;
    updateUrlParams({ year });
    yearElement.innerHTML = year.toString();
    previousYearElement.innerHTML = (year - 1).toString();

    updateLayer(value);

    const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
    const view = views[vType].view;
    const layerView = await view.whenLayerView(layer);
    const stats = await queryStats(layerView, year);
    updateParkVisitationDisplay(stats);
  });
}

export async function initializeYearSelect() {
  const container = document.getElementById("year-picker") as HTMLDivElement;
  container.style.display = "flex";

  const yearPicker = document.createElement("select") as HTMLSelectElement;
  yearPicker.classList.add("esri-widget");
  container.appendChild(yearPicker);
  const min = 1905;

  for (let y = year; y >= min; y--){
    const option = document.createElement("option") as HTMLOptionElement;
    option.value = y.toString();
    option.text = y.toString();
    option.selected = y === year;
    yearPicker.appendChild(option);
  }

  const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
  const view = views[vType].view;

  const layerView = await view.whenLayerView(layer);

  yearPicker.addEventListener("change", async () => {
    year = parseInt(yearPicker.value);
    yearElement.innerHTML = year.toString();
    previousYearElement.innerHTML = (year - 1).toString();

    updateLayer(year);

    const stats = await queryStats(layerView, year);
    updateParkVisitationDisplay(stats);
  });
}

function updateLayer(year: number){
  renderers[RendererVars.rendererType] = updateRenderer({
    renderer: layer.renderer as ClassBreaksRenderer,
    year,
    type: RendererVars.rendererType
  });

  layer.renderer = renderers[RendererVars.rendererType];
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