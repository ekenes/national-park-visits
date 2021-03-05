import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import { Extent } from "esri/geometry";
import { renderers, rendererType } from "./renderers";
import { createLabelingInfo } from "./labels";
import { createPopupTemplate } from "./popup";
import { UrlParams } from "./urlParams";
import { year } from "./widgets";
import { fromJSON } from "esri/geometry/support/jsonUtils";

export class ViewVars {
  public static viewType: UrlParams["viewType"] = null;
}

export const views = {
  ak: {
    container: document.getElementById("akViewDiv") as HTMLDivElement,
    view: null as any
  },
  hi: {
    container: document.getElementById("hiViewDiv") as HTMLDivElement,
    view: null as any
  },
  vi: {
    container: document.getElementById("viViewDiv") as HTMLDivElement,
    view: null as any
  },
  us: {
    container: document.getElementById("mainViewDiv") as HTMLDivElement,
    view: null as any
  }
};

export let layer: FeatureLayer = null;

export function createLayer(){
  const layer =  new FeatureLayer({
    title: "U.S. National Parks",
    portalItem: {
      id: "0e3fd5de259f46acb169c54eb501cfe5"
    },
    renderer: renderers[rendererType] ? renderers[rendererType] : new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: [255,0,0,0],
        outline: null
      })
    }),
    labelsVisible: true,
    labelingInfo: renderers[rendererType] ? createLabelingInfo(year) : null,
    popupTemplate: rendererType[rendererType] ? createPopupTemplate(year) : null,
    outFields: ["*"],
    layerId: 0,
    minScale: 0,
    maxScale: 0,
    popupEnabled: false
  });

  return layer;
}

export function createMap(){
  layer = createLayer();
  return new WebMap({
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
}

interface CreateViewParams {
  container: MapView["container"],
  map: MapView["map"],
  isMobile: boolean,
  isInset?: boolean
}

export async function createUsView(params: CreateViewParams) {
  const { container, map, isMobile, isInset } = params;

  container.style.display = "flex";

  const mobileScale = 36353220;
  const desktopScale = 16723716;
  const scale = isMobile ? mobileScale : desktopScale;

  const center = fromJSON({"spatialReference":{"wkid":5070},"x":-7456.301870036883,"y":1666581.490601381});

  const mobileConstraints = {
    rotationEnabled: false,
    minScale: mobileScale,
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
  };

  const desktopConstraints = {
    rotationEnabled: false,
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
  };

  const constraints = isMobile ? mobileConstraints : desktopConstraints;

  const usView = new MapView({
    map,
    container,
    popup: {
      highlightEnabled: true,
      dockEnabled: true,
      dockOptions: {
        breakpoint: false,
        position: "top-right"
      }
    },
    center,
    scale,
    constraints,
    spatialReference: {
      // NAD_1983_Contiguous_USA_Albers
      wkid: 5070
    },
    ui: {
      components: ["attribution"]
    }
  });
  return await usView.when();
}

export async function createAkView(params: CreateViewParams){
  const { container, map, isMobile, isInset } = params;

  container.style.display = "flex";

  const mobileScale = 24510951;
  const desktopScale = 13076340;
  const insetScale = 40436349;
  const scale = isInset ? insetScale : isMobile ? mobileScale : desktopScale;

  const insetCenter = fromJSON({"spatialReference":{"wkid":5936},"x":2103194.674427798,"y":-957221.1614695506});
  const fullCenter = fromJSON({"spatialReference":{"wkid":5936},"x":1811978.2456641502,"y":-1043832.0433061125});

  const center = isInset ? insetCenter : fullCenter;

  const mobileConstraints = {
    rotationEnabled: false,
    minScale: isInset ? insetScale : mobileScale,
    maxScale: 5893891,
    geometry: new Extent({
      spatialReference: {
        wkid: 5936
      },
      xmin: 737823.0703569443,
      ymin: -2103604.250401656,
      xmax: 3689660.4504700145,
      ymax: 110273.7846831464
    })
  };

  const desktopConstraints = {
    rotationEnabled: false,
    minScale: desktopScale,
    maxScale: 4338033,
    geometry: new Extent({
      spatialReference: {
        wkid: 5936
      },
      xmin: 737823.0703569443,
      ymin: -2103604.250401656,
      xmax: 3689660.4504700145,
      ymax: 110273.7846831464
    })
  };

  const constraints = isInset || isMobile ? mobileConstraints : desktopConstraints;

  const akView = new MapView({
    map,
    container,
    center,
    scale,
    constraints,
    spatialReference: {
      // WGS_1984_EPSG_Alaska_Polar_Stereographic
      wkid: 5936
    },
    ui: {
      components: []
    }
  });
  return await akView.when();
}

export function createHiView(params: CreateViewParams){
  const { container, map, isMobile, isInset } = params;

  container.style.display = "flex";

  const mobileScale = 5728779;
  const desktopScale = 2416226;
  const insetScale = 16833054;
  const scale = isInset ? insetScale : isMobile ? mobileScale : desktopScale;

  const insetCenter = fromJSON({"spatialReference":{"wkid":102007},"x":143836.25219758786,"y":869819.4196612639});
  const fullCenter = fromJSON({"spatialReference":{"wkid":102007},"x":-4804.986580757636,"y":856852.2343004141});

  const center = isInset ? insetCenter : fullCenter;

  const mobileConstraints = {
    rotationEnabled: false,
    minScale: isInset ? insetScale : 10099832,
    maxScale: 2874526,
    geometry: new Extent({
      spatialReference: {
        wkid: 102007
      },
      xmin: -390787.1649959057,
      ymin: 564313.6231185358,
      xmax: 756460.4545479296,
      ymax: 1183827.3376722068
    })
  };

  const desktopConstraints = {
    rotationEnabled: false,
    minScale: 1315641,
    maxScale: 4766466,
    geometry: new Extent({
      spatialReference: {
        wkid: 5936
      },
      xmin: 737823.0703569443,
      ymin: -2103604.250401656,
      xmax: 3689660.4504700145,
      ymax: 110273.7846831464
    })
  };

  const constraints = isInset || isMobile ? mobileConstraints : desktopConstraints;

  const hiView = new MapView({
    map,
    container,
    center,
    scale,
    constraints,
    spatialReference: {
      // Hawaii_Albers_Equal_Area_Conic
      wkid: 102007
    },
    ui: {
      components: []
    }
  });
  return hiView.when();
}

export async function createViView(params: CreateViewParams){
  const { container, map, isMobile, isInset } = params;

  container.style.display = "flex";
  const viView = new MapView({
    map,
    container,
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
      rotationEnabled: false,
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
  return await viView.when();
}

function destroyView(view: MapView, key: string){
  if(view){
    view.map.removeAll();
    view.container.style.display = "none";
    view.container = null;
    view.map = null;
    views[key].view = null;
  }
}

export function destroyAllViews(){
  for (let k in views){
    const view = views[k].view;
    destroyView(view, k);
  }
}