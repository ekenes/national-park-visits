import esri = __esri;
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");

export async function queryStats(layerView:esri.FeatureLayerView, year:number): Promise<any> {
  const query = layerView.createQuery();
  const onStatisticField = createCumulativeSumField(year);

  query.outStatistics = [
    new StatisticDefinition({
      statisticType: "sum",
      onStatisticField,
      outStatisticFieldName: "total_accumulated_visitation"
    }), new StatisticDefinition({
      statisticType: "sum",
      onStatisticField: `F${year}`,
      outStatisticFieldName: "annual_visitation"
    }), new StatisticDefinition({
      statisticType: "sum",
      onStatisticField: year > 1904 ? `F${year-1}` : "F1904",
      outStatisticFieldName: "previous_annual_visitation"
    })
  ];

  // queried from in-memory data available on the client for rendering
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