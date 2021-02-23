export const highestGrowthArcade = `
  var highest = -Infinity;
  var previousValue = null;
  var value = null;
  var highestYear = null;
  for (var att in $feature){
    if( typeof($feature[att]) == 'Number' && Find('F', att) > -1){
      if(Find('F_1904', att) == -1){
        value = $feature[att] - previousValue;
        if(value > highest){
          highest = value;
          highestYear = Mid(att, 1,4);
        }
        previousValue = $feature[att];
      } else {
        previousValue = $feature[att];
      }
    }
  }
  return highestYear + " (" + Text(highest, "#,###") + ")";
`;

export const lowestGrowthArcade = `
  var lowest = Infinity;
  var previousValue = null;
  var value = null;
  var lowestYear = null;
  for (var att in $feature){
    var value = $feature[att];
    if( typeof(value) == 'Number' && Find('F', att) > -1){
      if(Find('F1904', att) == -1){
        value = $feature[att] - previousValue;
        if(value < lowest){
          lowest = value;
          lowestYear = Mid(att, 1,4);
        }

        previousValue = $feature[att];
      } else {
        previousValue = $feature[att];
      }
    }
  }
  return lowestYear + " (" + Text(lowest, "#,###") + ")";
`;

export const visitationChangeArcade = `
  var lowest = Infinity;
  var ignoreFields = [ "OBJECTID", "x", "y", "Range" ];
  for (var att in $feature){
    var value = $feature[att];
    if( typeof(value) == 'Number' && IndexOf(ignoreFields, att) == -1){
      lowest = IIF(value < lowest, value, lowest);
    }
  }
  return lowest;
`;