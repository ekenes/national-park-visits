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
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { Extent } from "esri/geometry";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";
import { createRenderer, updateRenderer } from "./renderer";

(async () => {

  interface UrlParams {
    viewType?: "all" | "us" | "ak" | "hi" | "vi"
  }

  function getUrlParams() {
    const queryParams = document.location.search.substr(1);
    let result: UrlParams = {};

    queryParams.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = parseInt(decodeURIComponent(item[1]));
    });

    if (result && result.viewType){
      return result.viewType;
    }
    return;
  }

  // function to set an id as a url param
  function setUrlParams(viewType: UrlParams["viewType"]) {
    window.history.pushState("", "", `${window.location.pathname}?view=${viewType}`);
  }

  let viewType = getUrlParams();

  if(!viewType){
    viewType = isMobileBrowser() ? "us" : "all";
    setUrlParams(viewType);
  }

  const layer = new FeatureLayer({
    title: "U.S. National Parks",
    portalItem: {
      id: "0e3fd5de259f46acb169c54eb501cfe5"
    },
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: [0,0,0,0],
        outline: null
      })
    }),
    outFields: ["*"],
    layerId: 0,
    minScale: 0,
    maxScale: 0,
    popupEnabled: false
  });

  const map = new WebMap({
    basemap: {
      baseLayers: [
        new FeatureLayer({
          popupEnabled: false,
          portalItem: {
            id: "99fd67933e754a1181cc755146be21ca"
          },
          minScale: 0,
          maxScale: 0,
          renderer: new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: "#f7ebd6",
              outline: {
                style: "solid",
                width: 1,
                color : "#dcd8d0"
              }
            })
          }),
          effect: "grayscale(0.3) drop-shadow(0px 7px 20px gray)"
        }),
        new FeatureLayer({
          popupEnabled: false,
          portalItem: {
            id: "f092c20803a047cba81fbf1e30eff0b5"
          },
          minScale: 0,
          maxScale: 0,
          definitionExpression: `NAME LIKE '%NP%' OR NAME LIKE '%National Park%'`,
          effect: "grayscale(0.3) opacity(0.55) drop-shadow(2px 2px 10px green)"
        })
      ]
    },
    layers: [layer]
  });

  const mainExtent = {
    spatialReference: {
      wkid: 5070
    },
    xmin: -2985714.7547551794,
    ymin: 66403.41816565767,
    xmax: 2965420.009085534,
    ymax: 3244802.8703926024
  };

  const mainView = new MapView({
    container: "mainViewDiv",
    map,
    popup: {
      highlightEnabled: true,
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "top-right"
      }
    },
    extent: mainExtent,
    constraints: {
      minScale: 16215262,
      maxScale: 2000000,
      geometry: new Extent({
        spatialReference: {
          wkid: 5070
        },
        xmin: -1921286.8554006994,
        ymin: 726332.1394147258,
        xmax: 1694697.29902421,
        ymax: 2715123.424348426
      })
    },
    spatialReference: {
      // NAD_1983_Contiguous_USA_Albers
      wkid: 5070
    },
    ui: {
      components: ["attribution"]
    }
  });

  const legend = new Legend({
    view: mainView,
    container: document.getElementById("legend")
  });

  const yearElement = document.getElementById("year") as HTMLSpanElement;
  const previousYearElement = document.getElementById("previous-year") as HTMLSpanElement;

  const annualVisitsElement = document.getElementById("annual-visits") as HTMLSpanElement;
  const percentChangeElement = document.getElementById("percent-change") as HTMLSpanElement;
  const totalChangeElement = document.getElementById("total-change") as HTMLSpanElement;

  const akExtent = new Extent({
    spatialReference: {
      wkid: 5936
    },
    xmin: 737823.0703569443,
    ymin: -2103604.250401656,
    xmax: 3689660.4504700145,
    ymax: 110273.7846831464
  });

  const akView = new MapView({
    container: "akViewDiv",
    map: map,
    extent: akExtent,
    spatialReference: {
      // WGS_1984_EPSG_Alaska_Polar_Stereographic
      wkid: 5936
    },
    constraints: {
      minScale: 36810426,
      maxScale: 12400323,
      geometry: new Extent({
        spatialReference: {
          wkid: 5936
        },
        xmin: 737823.0703569443,
        ymin: -2103604.250401656,
        xmax: 3689660.4504700145,
        ymax: 110273.7846831464
      })
    },
    ui: {
      components: []
    }
  });

  const hiView = new MapView({
    container: "hiViewDiv",
    map,
    extent: new Extent({
      spatialReference: {
        wkid: 102007
      },
      xmin: -390787.1649959057,
      ymin: 564313.6231185358,
      xmax: 756460.4545479296,
      ymax: 1183827.3376722068
    }),
    spatialReference: {
      // Hawaii_Albers_Equal_Area_Conic
      wkid: 102007
    },
    constraints: {
      minScale: 17344181,
      geometry: new Extent({
        spatialReference: {
          wkid: 102007
        },
        xmin: -390787.1649959057,
        ymin: 564313.6231185358,
        xmax: 756460.4545479296,
        ymax: 1183827.3376722068
      })
    },
    ui: {
      components: []
    }
  });

  const viView = new MapView({
    container: "viViewDiv",
    map,
    extent: {
      spatialReference: {
        wkid: 5070
      },
      xmin: 3368052.0840510447,
      ymin: 56364.032814495884,
      xmax: 3369766.5874800514,
      ymax: 58078.53624350274
    },
    spatialReference: {
      wkid: 5070
    },
    constraints: {
      minScale: 43200,
      maxScale: 43200,
      geometry: new Extent({
        spatialReference: {
          wkid: 5070
        },
        xmin: 3368052.0840510447,
        ymin: 56364.032814495884,
        xmax: 3369766.5874800514,
        ymax: 58078.53624350274
      })
    },
    ui: {
      components: []
    }
  });

  const slider = new Slider({
    disabled: true,
    container: "timeSlider",
    min: 1905,
    max: 2019,
    values: [ 2019 ],
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

  let year = 0;

  mainView
    .when()
    .then(initializeSlider)
    .then(maintainFixedExtent)
    .then(enableHighlightOnPointerMove)
  akView
    .when()
    .then(enableHighlightOnPointerMove)
  hiView
    .when()
    .then(disableNavigation)
    .then(enableHighlightOnPointerMove)
  viView
    .when()
    .then(disableNavigation)
    .then(enableHighlightOnPointerMove)

  let layerView: esri.FeatureLayerView;

  let featureWidget = new Feature({
    map: mainView.map,
    spatialReference: mainView.spatialReference,
    container: document.getElementById("feature")
  });

  async function initializeSlider() {
    year = slider.values[0];
    yearElement.innerHTML = year.toString();
    previousYearElement.innerHTML = (year-1).toString();
    layerView = await mainView.whenLayerView(layer);
    watchUtils.whenFalseOnce(layerView, "updating", async () => {
      await queryStats(layerView, year)
      .then(updateParkVisitationDisplay);

      await createRenderer({
        layer,
        view: mainView,
        year
      });

      layer.popupTemplate = createPopupTemplate(year);
      layer.labelingInfo = createLabelingInfo(year);
      slider.disabled = false;
    });

    slider.watch("values", ([ value ]) => {
      yearElement.innerHTML = value;
      previousYearElement.innerHTML = (value - 1).toString();
      updateRenderer(value);
      layer.popupTemplate = createPopupTemplate(value);
      layer.labelingInfo = createLabelingInfo(value);

      queryStats(layerView, value)
        .then(updateParkVisitationDisplay);
    });
    return mainView;
  }




  function maintainFixedExtent(view: MapView) {
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

  async function enableHighlightOnPointerMove(view: MapView) {
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



  async function queryStats(layerView:esri.FeatureLayerView, year:number){
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

  function isMobileBrowser() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
    return check;
  };

})();