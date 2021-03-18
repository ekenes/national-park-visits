export type UrlParams = {
  viewType?: "all" | "us" | "ak" | "hi" | "vi";
  variable?: "percent-change" | "total-change" | "bivariate";
  year?: number;
}

export function getUrlParams() {
  const queryParams = document.location.search.substr(1);
  let result: UrlParams = {};

  queryParams.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });

  result = {
    viewType: result.viewType || "all",
    variable: result.variable || "percent-change",
    year: parseInt(result.year as any) || 2020
  };

  setUrlParams(result);
  return result;
}

// function to set an id as a url param
export function setUrlParams(params: UrlParams) {
  const { viewType, variable, year } = params;
  window.history.pushState("", "", `${window.location.pathname}?viewType=${viewType}&variable=${variable}&year=${year}`);
}

export function updateUrlParams(params: UrlParams){
  const urlParams = getUrlParams();
  for (const p in params){
    urlParams[p] = params[p];
  };
  setUrlParams(urlParams);
}