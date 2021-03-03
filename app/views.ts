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

const usExtent = {
  spatialReference: {
    wkid: 5070
  },
  xmin: -2985714.7547551794,
  ymin: 66403.41816565767,
  xmax: 2965420.009085534,
  ymax: 3244802.8703926024
};

const usView = new MapView({
  container: "usViewDiv",
  map,
  popup: {
    highlightEnabled: true,
    dockEnabled: true,
    dockOptions: {
      breakpoint: false,
      position: "top-right"
    }
  },
  extent: usExtent,
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
  view: usView,
  container: document.getElementById("legend")
});

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



const views = {
  ak: {
    container: document.getElementById("akViewDiv") as HTMLDivElement,
    view: akView
  },
  hi: {
    container: document.getElementById("hiViewDiv") as HTMLDivElement,
    view: hiView
  },
  vi: {
    container: document.getElementById("viViewDiv") as HTMLDivElement,
    view: viView
  },
  us: {
    container: document.getElementById("usViewDiv") as HTMLDivElement,
    view: usView
  }
}