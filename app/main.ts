import WebMap = require("esri/WebMap");

import { createViView, createAkView, createHiView, createUsView, createMap, views, destroyAllViews, ViewVars, layer } from "./views";
import { getUrlParams, updateUrlParams, UrlParams } from "./urlParams";
import { initializeSlider, updateViewWidgets, disableSelectOptionByValue, year, updateParkVisitationDisplay } from "./widgets";
import { disableNavigation, enableHighlightOnPointerMove, isMobileBrowser, maintainFixedExtent } from "./viewUtils";
import { whenFalseOnce } from "esri/core/watchUtils";
import { queryStats } from "./stats";
import { renderers, RendererVars, createRenderer, updateRenderer } from "./renderers";
import { createPopupTemplate } from "./popup";
import { createLabelingInfo } from "./labels";

(async () => {

  const viewSelect = document.getElementById("viewSelect") as HTMLSelectElement;
  const rendererSelect = document.getElementById("rendererSelect") as HTMLSelectElement;

  const uParams = getUrlParams();
  ViewVars.viewType = uParams.viewType;
  RendererVars.rendererType = uParams.variable;

  const isMobile = isMobileBrowser();

  [...(viewSelect.children as any)].forEach(child => {
    if(isMobile && child.value === "all"){
      child.style.display = "none";
      return;
    }
    child.checked = child.value === ViewVars.viewType;
  });

  [...(rendererSelect.children as any)].forEach(child => {
    child.checked = child.value === RendererVars.rendererType;
  });

  viewSelect.value = ViewVars.viewType;

  viewSelect.addEventListener("calciteRadioGroupChange", async (e:any)=> {
    const viewType = e.detail;
    ViewVars.viewType = viewType as UrlParams["viewType"];
    updateUrlParams({
      viewType
    });
    await renderViews(ViewVars.viewType);
    updateViewWidgets(isMobile);
  });

  rendererSelect.addEventListener("calciteRadioGroupChange", async (e:any)=> {
    const variable = e.detail;
    RendererVars.rendererType = variable as UrlParams["variable"];
    updateUrlParams({
      variable
    });

    layer.labelingInfo = createLabelingInfo(year);

    if(renderers[RendererVars.rendererType]){
      const renderer = renderers[RendererVars.rendererType];
      renderers[RendererVars.rendererType] = updateRenderer({
        renderer,
        year,
        type: RendererVars.rendererType
      });
      layer.renderer = renderers[RendererVars.rendererType];
      return;
    }

    const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
    const view = views[vType].view;

    renderers[RendererVars.rendererType] = await createRenderer({
      layer,
      view,
      year,
      type: RendererVars.rendererType
    });
    layer.renderer = renderers[RendererVars.rendererType];
  });

  await renderViews(ViewVars.viewType);

  const vType: UrlParams["viewType"] = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
  const view = views[vType].view;

  const layerView = await view.whenLayerView(layer);

  whenFalseOnce(layerView, "updating", async () => {
    const stats = await queryStats(layerView, year);
    updateParkVisitationDisplay(stats);

    renderers[RendererVars.rendererType] = await createRenderer({
      layer,
      view,
      year,
      type: RendererVars.rendererType
    });

    layer.renderer = renderers[RendererVars.rendererType];
    layer.popupTemplate = createPopupTemplate(year);
    layer.labelingInfo = createLabelingInfo(year);

    updateViewWidgets(isMobile);
    initializeSlider();
  });

  async function createAllViews(map: WebMap){

    views.us.view = await createUsView({
      container: views.us.container,
      map,
      isMobile,
      isInset: false
    })
    .then(maintainFixedExtent)
    .then(enableHighlightOnPointerMove)

    views.ak.view = await createAkView({
      container: views.ak.container,
      map,
      isMobile,
      isInset: true
    })
    .then(enableHighlightOnPointerMove)

    views.hi.view = await createHiView({
      container: views.hi.container,
      map,
      isMobile,
      isInset: true
    })
    .then(disableNavigation)
    .then(enableHighlightOnPointerMove)

    views.vi.view = await createViView({
      container: views.vi.container,
      map,
      isMobile,
      isInset: true
    })
    .then(disableNavigation)
    .then(enableHighlightOnPointerMove)

    return views;
  }

  async function renderViews(newValue: UrlParams["viewType"]) {

    destroyAllViews();

    const map = createMap();

    switch(newValue){
      case "all":
        await createAllViews(map);
        break;
      case "us":
        views.us.view = await createUsView({
          container: views.us.container,
          map,
          isMobile,
          isInset: false
        })
        .then(enableHighlightOnPointerMove)
        break;
      case "ak":
        views.ak.view = await createAkView({
          container: views.us.container,
          map,
          isMobile,
          isInset: false
        })
        .then(enableHighlightOnPointerMove)
        break;
      case "hi":
        views.hi.view = await createHiView({
          container: views.us.container,
          map,
          isMobile,
          isInset: false
        })
        .then(enableHighlightOnPointerMove)
        break;
      case "vi":
        views.vi.view = await createViView({
          container: views.us.container,
          map,
          isMobile,
          isInset: false
        })
        .then(enableHighlightOnPointerMove)
        break;
      default:
        break;
    }
  }

})();