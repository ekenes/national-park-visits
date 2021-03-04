import esri = __esri;

import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
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
import { createViView, createAkView, createHiView, createUsView, layer, createMap, views, destroyAllViews } from "./views";

(async () => {

  const viewSelect = document.getElementById("viewSelect") as HTMLSelectElement;

  interface UrlParams {
    viewType?: "all" | "us" | "ak" | "hi" | "vi"
  }

  function getUrlParams() {
    const queryParams = document.location.search.substr(1);
    let result: UrlParams = {};

    queryParams.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result && result.viewType){
      return result.viewType;
    }
    return "all";
  }

  // function to set an id as a url param
  function setUrlParams(viewType: UrlParams["viewType"]) {
    window.history.pushState("", "", `${window.location.pathname}?viewType=${viewType}`);
  }

  const yearElement = document.getElementById("year") as HTMLSpanElement;
  const previousYearElement = document.getElementById("previous-year") as HTMLSpanElement;

  const annualVisitsElement = document.getElementById("annual-visits") as HTMLSpanElement;
  const percentChangeElement = document.getElementById("percent-change") as HTMLSpanElement;
  const totalChangeElement = document.getElementById("total-change") as HTMLSpanElement;


  async function createAllViews(map: WebMap){

    views.us.view = await createUsView(views.us.container, map)
      .then(maintainFixedExtent)
      .then(enableHighlightOnPointerMove)
    views.ak.view = await createAkView(views.ak.container, map)
      .then(enableHighlightOnPointerMove)
    views.hi.view = await createHiView(views.hi.container, map)
      .then(disableNavigation)
      .then(enableHighlightOnPointerMove)
    views.vi.view = await createViView(views.vi.container, map)
      .then(disableNavigation)
      .then(enableHighlightOnPointerMove)

    return views;
  }

  function disableSelectOptionByValue(selectElement: HTMLSelectElement, value: string){
    const op = selectElement.getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
      (op[i].value.toLowerCase() == value.toLowerCase())
        ? op[i].disabled = true
        : op[i].disabled = false;
    }
  }

  function enableSelectOptionsAll(selectElement: HTMLSelectElement){
    const op = selectElement.getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
      op[i].disabled = false;
    }
  }

  let viewType = getUrlParams();

  if(isMobileBrowser()){
    viewType = viewType === "all" ? "us" : viewType;
    disableSelectOptionByValue(viewSelect, "all");
  }

  setUrlParams(viewType);
  viewSelect.value = viewType;


  viewSelect.addEventListener("change", async ()=> {
    viewType = viewSelect.value as UrlParams["viewType"];
    await renderViews(viewType);
    udpateViewWidgets();
  });

  await renderViews(viewType);

  let layerView: esri.FeatureLayerView;
  let featureWidget: Feature;
  let legend: Legend;

  udpateViewWidgets();

  function udpateViewWidgets(){
    const vType: UrlParams["viewType"] = viewType === "all" ? "us" : viewType;
    const view = views[vType].view;

    if(!featureWidget){
      featureWidget = new Feature({
        container: document.getElementById("feature")
      });
    }
    featureWidget.map = view.map;
    featureWidget.spatialReference = view.spatialReference;

    if(!legend){
      legend = new Legend({
        container: document.getElementById("legend")
      });
    }
    legend.view = view;
  }

  const slider = new Slider({
    disabled: true,
    container: "timeSlider",
    min: 1905,
    max: 2020,
    values: [ 2020 ],
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

  initializeSlider();

  async function initializeSlider() {
    const year = slider.values[0];

    const vType: UrlParams["viewType"] = viewType === "all" ? "us" : viewType;
    const view = views[vType].view;

    yearElement.innerHTML = year.toString();
    previousYearElement.innerHTML = (year-1).toString();
    layerView = await view.whenLayerView(layer);
    watchUtils.whenFalseOnce(layerView, "updating", async () => {
      const stats = await queryStats(layerView, year);
      updateParkVisitationDisplay(stats);

      renderers[rendererType] = await createRenderer({
        layer,
        view,
        year,
        type: rendererType
      });

      layer.renderer = renderers[rendererType];
      layer.popupTemplate = createPopupTemplate(year);
      layer.labelingInfo = createLabelingInfo(year);
      slider.disabled = false;
    });

    slider.watch("values", async ([ value ]) => {
      yearElement.innerHTML = value;
      previousYearElement.innerHTML = (value - 1).toString();

      updateLayer(value);

      const stats = await queryStats(layerView, value);
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

  function maintainFixedExtent(view: MapView): MapView {
    var fixedExtent = view.extent.clone();
    // keep a fixed extent in the view
    // when the view size changes
    view.on("resize", function () {
      view.extent = fixedExtent;
    });
    return view;
  }

  let highlight: esri.Handle = null;
  let lastHighlight: esri.Handle = null;

  async function enableHighlightOnPointerMove(view: MapView): Promise<MapView> {
    const layerView = await view.whenLayerView(layer);
    view.on("pointer-move", async (event) => {
      const response = await view.hitTest(event, {
        include: layer
      });
      lastHighlight = highlight;

      // if a feature is returned, highlight it
      // and display its attributes in the popup
      // if no features are returned, then close the popup
      var id = null;

      if (response && response.results.length) {
        var feature = response.results[0].graphic;

        // feature.popupTemplate = layer.popupTemplate;
        id = feature.getObjectId();
        highlight = layerView.highlight([id]);
        var selectionId = featureWidget.graphic
          ? featureWidget.graphic.getObjectId()
          : null;

        if (highlight && id !== selectionId) {
          featureWidget.graphic = feature;
          (featureWidget.container as HTMLElement).style.display = "block";
        }
      } else {
        if (featureWidget.graphic) {
          featureWidget.graphic = null;
          (featureWidget.container as HTMLElement).style.display = "none";
        }
      }

      // remove the previous highlight
      if (lastHighlight) {
        lastHighlight.remove();
        lastHighlight = null;
      }
    });

    return view;
  }

  // disables all navigation in the view
  function disableNavigation(view: MapView) {
    view.popup.dockEnabled = true;

    // Removes the zoom action on the popup
    view.popup.actions = null;

    // stops propagation of default behavior when an event fires
    function stopEvtPropagation(event:any) {
      event.stopPropagation();
    }

    // disable mouse wheel scroll zooming on the view
    view.navigation.mouseWheelZoomEnabled = false;

    // disable zooming via double-click on the view
    view.on("double-click", stopEvtPropagation);

    // disable zooming out via double-click + Control on the view
    view.on("double-click", ["Control"], stopEvtPropagation);

    // disables pinch-zoom and panning on the view
    view.navigation.browserTouchPanEnabled = false;
    view.on("drag", stopEvtPropagation);

    // disable the view's zoom box to prevent the Shift + drag
    // and Shift + Control + drag zoom gestures.
    view.on("drag", ["Shift"], stopEvtPropagation);
    view.on("drag", ["Shift", "Control"], stopEvtPropagation);

    // prevents zooming and rotation with the indicated keys
    view.on("key-down", function (event) {
      var prohibitedKeys = ["+", "-", "_", "=", "a", "d"];
      var keyPressed = event.key.toLowerCase();
      if (prohibitedKeys.indexOf(keyPressed) !== -1) {
        event.stopPropagation();
      }
    });

    return view;
  }

  function updateParkVisitationDisplay(stats: Graphic["attributes"]){
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

  async function renderViews(newValue: UrlParams["viewType"]) {
    setUrlParams(newValue);

    destroyAllViews();

    const esriMap = createMap();

    switch(newValue){
      case "all":
        await createAllViews(esriMap);
        break;
      case "us":
        views.us.view = await createUsView(views.us.container, esriMap)
          .then(enableHighlightOnPointerMove)
        break;
      case "ak":
        views.ak.view = await createAkView(views.us.container, esriMap)
          .then(enableHighlightOnPointerMove)
        break;
      case "hi":
        views.hi.view = await createHiView(views.us.container, esriMap)
          .then(enableHighlightOnPointerMove)
        break;
      case "vi":
        views.vi.view = await createViView(views.us.container, esriMap)
          .then(enableHighlightOnPointerMove)
        break;
      default:
        break;
    }
  }

  function isMobileBrowser() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
    return check;
  };

})();