export type UrlParams = {
  viewType?: "all" | "us" | "ak" | "hi" | "vi"
}

export function getUrlParams() {
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
export function setUrlParams(viewType: UrlParams["viewType"]) {
  window.history.pushState("", "", `${window.location.pathname}?viewType=${viewType}`);
}