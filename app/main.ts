import WebMap = require("esri/WebMap");
import { createViView, createAkView, createHiView, createUsView, createMap, views, destroyAllViews, ViewVars } from "./views";
import { getUrlParams, setUrlParams, UrlParams } from "./urlParams";
import { initializeSlider, udpateViewWidgets, disableSelectOptionByValue } from "./widgets";
import { disableNavigation, enableHighlightOnPointerMove, isMobileBrowser, maintainFixedExtent } from "./viewUtils";

(async () => {

  const viewSelect = document.getElementById("viewSelect") as HTMLSelectElement;

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

  ViewVars.viewType = getUrlParams();

  if(isMobileBrowser()){
    ViewVars.viewType = ViewVars.viewType === "all" ? "us" : ViewVars.viewType;
    disableSelectOptionByValue(viewSelect, "all");
  }

  setUrlParams(ViewVars.viewType);
  viewSelect.value = ViewVars.viewType;


  viewSelect.addEventListener("change", async ()=> {
    ViewVars.viewType = viewSelect.value as UrlParams["viewType"];
    await renderViews(ViewVars.viewType);
    udpateViewWidgets();
  });

  await renderViews(ViewVars.viewType);

  udpateViewWidgets();
  initializeSlider();

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

})();