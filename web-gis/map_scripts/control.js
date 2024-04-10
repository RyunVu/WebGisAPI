// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ====================================== CONTROLS ======================================
// ---------------------------------------------------------------------------------------------------------------------------------------------------

var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: "click",
    startActive: false,
    groupSelectStyle: "children",
  });
  
  map.addControl(layerSwitcher);
  
 
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  var scaleControl = new ol.control.ScaleLine({});
  
  map.addControl(scaleControl);
  
  var containter = document.getElementById("popup");
  var content = document.getElementById("popup-content");
  var closer = document.getElementById("popup-closer");
  
  var popup = new ol.Overlay({
    element: containter,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
  
  map.addOverlay(popup);
  
  closer.onclick = function () {
    popup.setPosition(undefined);
    // closer.blur();
    return false;
  };
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  // ====================================== CUSTOM CONTROL ======================================
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // home button
  
  var homeBtn = document.createElement("button");
  homeBtn.innerHTML =
    '<img src="./resources/home.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  homeBtn.className = "myBtn";
  
  var homeElement = document.createElement("div");
  homeElement.className = "homeBtnDiv";
  homeElement.appendChild(homeBtn);
  
  var homeControl = new ol.control.Control({
    element: homeElement,
  });
  
  homeBtn.addEventListener("click", () => {
    location.href = "index.html";
  });
  
  map.addControl(homeControl);
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // full srceen button
  
  var fullScreenBtn = document.createElement("button");
  fullScreenBtn.innerHTML =
    '<img src="./resources/full_screen.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  fullScreenBtn.className = "myBtn";
  
  var fullSreenElement = document.createElement("div");
  fullSreenElement.className = "fullScreenBtnDiv";
  fullSreenElement.appendChild(fullScreenBtn);
  
  var fullScreenControl = new ol.control.Control({
    element: fullSreenElement,
  });
  
  fullScreenBtn.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullscreen) {
      mapEle.requestFullscreen();
    } else if (mapEle.msRequestFullscreen) {
      mapEle.msRequestFullscreen();
    } else if (mapEle.mozRequestFullscreen) {
      mapEle.mozRequestFullscreen();
    } else if (mapEle.webkitRequestFullscreen) {
      mapEle.webkitRequestFullscreen();
    }
  });
  
  map.addControl(fullScreenControl);
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // Info button
  
  var infoBtn = document.createElement("button");
  infoBtn.innerHTML =
    '<img src="./resources/info.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  infoBtn.className = "myBtn";
  
  var infoElement = document.createElement("div");
  infoElement.className = "infoBtnDiv";
  infoElement.appendChild(infoBtn);
  
  var infoControl = new ol.control.Control({
    element: infoElement,
  });
  
  var featureInfoFlag = false;
  infoBtn.addEventListener("click", () => {
    infoBtn.classList.toggle("clicked");
    featureInfoFlag = !featureInfoFlag;
  });
  
  map.addControl(infoControl);
  
  map.on("singleclick", function (evt) {
    if (featureInfoFlag) {
      content.innerHTML = "";
      var resolution = mapView.getResolution();
  
      var url = LacDuongTile.getSource().getFeatureInfoUrl(
        evt.coordinate,
        resolution,
        "EPSG:3857",
        {
          INFO_FORMAT: "application/json",
          propertyName: "NAME_4",
        }
      );
  
      if (url) {
        $.getJSON(url, function (data) {
          var feature = data.features[0];
          var props = feature.properties;
          content.innerHTML =
            "<h3> Xã: </h3> <p>" + props.NAME_4.toUpperCase() + "</p>";
          popup.setPosition(evt.coordinate);
        });
      } else {
        popup.setPosition(undefined);
      }
    }
  });
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // Length Measurement Control
  
  var lengthBtn = document.createElement("button");
  lengthBtn.innerHTML =
    '<img src="./resources/length.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  lengthBtn.className = "myBtn";
  lengthBtn.id = "lengthBtn";
  
  var lengthElement = document.createElement("div");
  lengthElement.className = "lengthBtnDiv";
  lengthElement.appendChild(lengthBtn);
  
  var lengthControl = new ol.control.Control({
    element: lengthElement,
  });
  
  var lengthFlag = false;
  lengthBtn.addEventListener("click", () => {
    lengthBtn.classList.toggle("clicked");
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
      map.removeInteraction(draw);
      addInteraction("LineString");
    } else {
      map.removeInteraction(draw);
      source.clear();
      const elements = document.getElementsByClassName(
        "ol-tooltip ol-tooltip-static"
      );
      while (elements.length > 0) element[0].remove();
    }
  });
  
  map.addControl(lengthControl);
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // Area Measurement Control
  
  var areaBtn = document.createElement("button");
  areaBtn.innerHTML =
    '<img src="./resources/area.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  areaBtn.className = "myBtn";
  areaBtn.id = "areaBtn";
  
  var areaElement = document.createElement("div");
  areaElement.className = "areaBtnDiv";
  areaElement.appendChild(areaBtn);
  
  var areaControl = new ol.control.Control({
    element: areaElement,
  });
  
  var areaFlag = false;
  areaBtn.addEventListener("click", () => {
    areaBtn.classList.toggle("clicked");
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
      map.removeInteraction(draw);
      addInteraction("Polygon");
    } else {
      map.removeInteraction(draw);
      source.clear();
      const elements = document.getElementsByClassName(
        "ol-tooltip ol-tooltip-static"
      );
      while (elements.length > 0) elements[0].remove();
    }
  });
  
  map.addControl(areaControl);
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  /**
   * Message to show when the user is drawing a polygon
   * @type {string}
   */
  var continuePolygonMsg = "Click to continue polygon, Double click to complete";
  
  /**
   * Message to show when the user is drawing a line
   * @type {string}
   */
  var continueLineMsg = "Click to continue line, Double click to complete";
  
  var draw; // global so we can remove it later
  
  var source = new ol.source.Vector();
  var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rbga(255,255,255,0.2)",
      }),
      stroke: new ol.style.Stroke({
        color: "#ffcc33",
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#ffcc33",
        }),
      }),
    }),
  });
  
  map.addLayer(vector);
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  function addInteraction(intType) {
    draw = new ol.interaction.Draw({
      source: source,
      type: intType,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: "rgba(200, 200, 200, .6)",
        }),
        stroke: new ol.style.Stroke({
          color: "#rbga(0, 0, 0, .5)",
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: "#rbga(0, 0, 0, .7)",
          }),
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, .2)",
          }),
        }),
      }),
    });
    map.addInteraction(draw);
  
    createMeasureTooltip();
    createHelpTooltip();
  
    /**
     * Currently draw feature.
     * @type {import("../GISSimplified/node_modules/ol/Feature.js").default}
     */
    var sketch;
  
    /**
     * Handle pointer move.
     * @param {import("../GISSimplified/node_modules/ol/MapBrowserEvent.js").default} evt
     */
  
    var pointerMoveHandler = function (evt) {
      if (evt.dragging) return;
  
      /** @type {string} */
      var helpMsg = "Click to start drawing";
  
      if (sketch) {
        var geom = sketch.getGeometry();
      }
    };
  
    map.on("pointermove", pointerMoveHandler);
  
    // var listener
    draw.on("drawstart", function (evt) {
      // set sketch
      sketch = evt.feature;
  
      /**  @type {import("../GISSimplified/node_modules/ol/coordinate.js").Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;
  
      sketch.getGeometry().on("change", function (evt) {
        var geom = evt.target;
        var output;
  
        if (geom instanceof ol.geom.Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getLastCoordinate();
        } else if (geom instanceof ol.geom.LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });
  
    draw.on("drawend", function () {
      measureTooltipElement.className = "ol-tooltip ol-tooltip=static";
      measureTooltip.setOffset([0, -7]);
  
      sketch = null;
  
      measureTooltipElement = null;
      createMeasureTooltip();
    });
  }
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  /**
   * The hekp tooltip element.
   * @type {HTMLElement}
   */
  var helpTooltipElement;
  
  /**
   * Overlay to show the help messages.
   * @type {Overlay}
   */
  var helpTooltip;
  
  /**
   * Create a new help tooltip
   */
  function createHelpTooltip() {
    if (helpTooltipElement)
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  
    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "ol-tooltip hidden";
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    map.addOverlay(helpTooltip);
  }
  
  map.getViewport().addEventListener("mouseout", function () {
    if (helpTooltipElement) helpTooltipElement.classList.add("hidden");
  });
  
  /**
   * The measure tooltip element.
   * @type {HTMLElement}
   */
  var measureTooltipElement;
  
  /**
   * The measure tooltip element.
   * @type {Overlay}
   */
  var measureTooltip;
  
  /**
   * Create a new measure tooltip.
   */
  
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    map.addOverlay(measureTooltip);
  }
  
  /**
   * Format length output.
   * @param {LineString} line The line.
   * @returns {string} The formatted length.
   */
  
  var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };
  
  /**
   * Format area output.
   * @param {Polygon} polygon
   * @returns {string}
   */
  
  var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };
  
  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  
  // Query Attribute
  
  var geoserver;
  var geojson;
  var featureOverlay;
  
  var qryBtn = document.createElement("button");
  qryBtn.innerHTML =
    '<img src="./resources/query.svg" alt="" style="width:25px; filter:brightness(0) invert(1); vertical-align: middle;"></img>';
  qryBtn.className = "myBtn";
  qryBtn.id = "qryBtn";
  
  var qryElement = document.createElement("div");
  qryElement.className = "myBtnDiv";
  qryElement.appendChild(qryBtn);
  
  var qryControl = new ol.control.Control({
    element: qryElement,
  });
  
  var qryFlag = false;
  qryBtn.addEventListener("click", () => {
    qryBtn.classList.toggle("clicked");
    qryFlag = !qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
      clearAndRemoveLayers();
      document.getElementById("attQueryDiv").style.display = "block";
      bolIdentify = true;
      addMapLayerList();
    } else {
      document.getElementById("attQueryDiv").style.display = "none";
      clearAndRemoveLayers();
    }
  });
  
  map.addControl(qryControl);
  
  function addMapLayerList() {
    $.ajax({
      type: "GET",
      url: "http://localhost:8080/geoserver/wfs?service=wfs&version=1.1.0&request=GetCapabilities",
      dataType: "xml",
      success: function (xml) {
        var select = $("#selectLayer");
        select.append("<option class='ddindent' value=''></option>");
        $(xml)
          .find("FeatureType")
          .each(function () {
            $(this)
              .find("Name")
              .each(function () {
                var value = $(this).text();
                select.append(
                  "<option class='ddindent' value='" +
                    value +
                    "'>" +
                    value +
                    "</option>"
                );
              });
          });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching layer list:", error);
      },
    });
  }
  
  $("#selectLayer").change(function () {
    var select = $("#selectAttribute");
    select.empty();
    var value_layer = $(this).val();
    $.ajax({
      type: "GET",
      url:
        "http://localhost:8080/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" +
        value_layer,
      dataType: "xml",
      success: function (xml) {
        var select = $("#selectAttribute");
        $(xml)
          .find("xsd\\:sequence")
          .each(function () {
            $(this)
              .find("xsd\\:element")
              .each(function () {
                var value = $(this).attr("name");
                var type = $(this).attr("type");
                if (value != "geom" && value != "the_geom") {
                  select.append(
                    "<option class='ddindent' value='" +
                      type +
                      "'>" +
                      value +
                      "</option>"
                  );
                }
              });
          });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching attribute list:", error);
      },
    });
  });
  
  $("#selectAttribute").change(function () {
    var operator = $("#selectOperator");
    operator.empty();
    var value_type = $(this).val();
    var value_attribute = $("#selectAttribute option:selected").text();
    operator.append("<option value=''>Select operator</option>");
    if (
      value_type == "xsd:short" ||
      value_type == "xsd:int" ||
      value_type == "xsd:double"
    ) {
      operator.append("<option value='>'>Greater than</option>");
      operator.append("<option value='<'>Less than</option>");
      operator.append("<option value='='>Equal to</option>");
    } else if (value_type == "xsd:string") {
      operator.append("<option value='Like'>Like</option>");
      operator.append("<option value='='>Equal to</option>");
    }
  });
  
  $("#attQryRun").click(function () {
    map.set("isLoading", "YES");
    var layer = $("#selectLayer").val();
    var attribute = $("#selectAttribute").val();
    var attributeSelectedOption = $("#selectAttribute option:selected").text();
    var operator = $("#selectOperator").val();
    var txt = encodeURIComponent($("#enterValue").val());
  
    if (layer == "") {
      alert("Select Layer");
    } else if (attribute == "") {
      alert("Select Attribute");
    } else if (operator == "") {
      alert("Select Operator");
    } else if (txt.length == 0) {
      alert("Enter Value");
    } else {
      var value_txt = operator === "Like" ? "%" + txt + "%" : txt;
  
      var url =
        "http://localhost:8080/geoserver/GisTest/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=" +
        layer +
        "&cql_filter=" +
        attributeSelectedOption +
        operator +
        "'" +
        txt +
        "'&outputFormat=application/json";
  
      addGeoJsonToMap(url);
      populateQueryTable(url);
      setTimeout(function () {
        addRowHandlers(url);
      }, 300);
      map.set("isLoading", "NO");
    }
  });
  
  function addGeoJsonToMap(url) {
    clearAndRemoveLayers();
    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#FFFF00",
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: "#FFFF00",
        }),
      }),
    });
  
    geojson = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      style: style,
    });
  
    geojson.getSource().on("addfeature", function () {
      map.getView().fit(geojson.getSource().getExtent(), {
        duration: 1590,
        size: map.getSize(),
        maxZoom: 21,
      });
    });
  
    map.addLayer(geojson);
  }
  
  function populateQueryTable(url) {
    if (typeof attributePanel !== "undefined") {
      if (attributePanel.parentElement !== null) {
        attributePanel.close();
      }
    }
  
    $.getJSON(url, function (data) {
      var col = [];
      col.push("id");
      for (var i = 0; i < data.features.length; i++) {
        for (var key in data.features[i].properties) {
          if (!col.includes(key)) {
            col.push(key);
          }
        }
      }
  
      var table = document.createElement("table");
  
      table.setAttribute(
        "class",
        "table table-bordered table-hover table-condensed"
      );
      table.setAttribute("id", "attQryTable");
  
      var tr = table.insertRow(-1);
  
      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
      }
  
      for (var i = 0; i < data.features.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          if (j == 0) {
            tabCell.innerHTML = data.features[i]["id"];
          } else {
            tabCell.innerHTML = data.features[i].properties[col[j]];
          }
        }
      }
  
      var tabDiv = document.getElementById("attListDiv");
      var delTab = document.getElementById("attQryTable");
      if (delTab) {
        tabDiv.removeChild(delTab);
      }
      tabDiv.appendChild(table);
  
      document.getElementById("attListDiv").style.display = "block";
    });
  
    var highlightStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255,0,255,0.3)",
      }),
      stroke: new ol.style.Stroke({
        color: "#FF00FF",
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: "#FF00FF",
        }),
      }),
    });
  
    featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(),
      map: map,
      style: highlightStyle,
    });
  }
  
  function addRowHandlers() {
    var table = document.getElementById("attQryTable");
    var rows = document.getElementById("attQryTable").rows;
    var heads = table.getElementsByTagName("th");
    var col_no;
  
    for (var i = 0; i < heads.length; i++) {
      var head = heads[i];
      if (head.innerHTML == "id") {
        col_no = i + 1;
      }
    }
  
    for (i = 0; i < rows.length; i++) {
      rows[i].onclick = (function () {
        return function () {
          featureOverlay.getSource().clear();
  
          $(function () {
            $("#attQryTable td").each(function () {
              $(this).parent("tr").css("background-color", "white");
            });
          });
  
          var cell = this.cells[col_no - 1];
          var id = cell.innerHTML;
          $(document).ready(function () {
            $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
              if ($(this).text() == id) {
                $(this).parent("tr").css("background-color", "#d1d8e2");
              }
            });
          });
  
          var features = geojson.getSource().getFeatures();
  
          for (i = 0; i < features.length; i++) {
            if (features[i].getId() == id) {
              featureOverlay.getSource().addFeature(features[i]);
  
              featureOverlay.getSource().on("addfeature", function () {
                map.getView().fit(featureOverlay.getSource().getExtent(), {
                  duration: 1500,
                  size: map.getSize(),
                  maxZoom: 24,
                });
              });
            }
          }
        };
      })(rows[i]);
    }
  }
  
  function clearAndRemoveLayers() {
    if (geojson) {
      geojson.getSource().clear();
      map.removeLayer(geojson);
    }
    if (featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
  }
  