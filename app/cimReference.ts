import esri = __esri;

export const cimReference: esri.CIMSymbolProperties["data"] = {
  "type": "CIMSymbolReference",
  "symbol": {
    "type": "CIMPointSymbol",
    "symbolLayers": [
      {
        "type": "CIMVectorMarker",
        "enable": true,
        "anchorPointUnits": "Relative",
        "dominantSizeAxis3D": "Y",
        "size": 15.75,
        "billboardMode3D": "FaceNearPlane",
        "frame": {
          "xmin": 4,
          "ymin": 2,
          "xmax": 17,
          "ymax": 19
        },
        "markerGraphics": [
          {
            "type": "CIMMarkerGraphic",
            "geometry": {
              "rings": [
                [
                  [
                    15,
                    15
                  ],
                  [
                    12,
                    15
                  ],
                  [
                    16,
                    10
                  ],
                  [
                    13,
                    10
                  ],
                  [
                    17,
                    5
                  ],
                  [
                    11,
                    5
                  ],
                  [
                    11,
                    2
                  ],
                  [
                    10,
                    2
                  ],
                  [
                    10,
                    5
                  ],
                  [
                    4,
                    5
                  ],
                  [
                    8,
                    10
                  ],
                  [
                    5,
                    10
                  ],
                  [
                    9,
                    15
                  ],
                  [
                    6,
                    15
                  ],
                  [
                    10.5,
                    19
                  ],
                  [
                    15,
                    15
                  ]
                ]
              ]
            },
            "symbol": {
              "type": "CIMPolygonSymbol",
              "symbolLayers": [
                {
                  "type": "CIMSolidStroke",
                  "enable": true,
                  "capStyle": "Round",
                  "joinStyle": "Round",
                  "lineStyle3D": "Strip",
                  "miterLimit": 10,
                  "width": 0.5,
                  "color": [
                    100,
                    100,
                    100,
                    128
                  ]
                },
                {
                  "type": "CIMSolidFill",
                  "enable": true,
                  "color": [
                    113,
                    201,
                    110,
                    255
                  ]
                }
              ]
            }
          }
        ],
        "scaleSymbolsProportionally": true,
        "respectFrame": true
      }
    ],
    "haloSize": 1,
    "scaleX": 1,
    "angleAlignment": "Display"
  }
};