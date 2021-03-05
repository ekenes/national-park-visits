import WebMap = require("esri/WebMap");
import { createViView, createAkView, createHiView, createUsView, createMap, views, destroyAllViews, ViewVars } from "./views";
import { getUrlParams, setUrlParams, UrlParams } from "./urlParams";
import { initializeSlider, udpateViewWidgets, disableSelectOptionByValue } from "./widgets";
import { disableNavigation, enableHighlightOnPointerMove, isMobileBrowser, maintainFixedExtent } from "./viewUtils";

(async () => {

  const viewSelect = document.getElementById("viewSelect") as HTMLSelectElement;
  ViewVars.viewType = getUrlParams();

  const isMobile = isMobileBrowser();

  if(isMobile){
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
    setUrlParams(newValue);

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