var map, heatmap;
currentQuery = "heatmap";

function initMap() {
  var singapore = new google.maps.LatLng(1.352083, 103.819836);

  // Initialize overall map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: singapore,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  callAPI();
  $('#btn-radius').click();
}

function callAPI() {
  var result;
  // Make POST request to API
  $.ajaxSetup({
    async: false
  });

  var data;
  if (currentQuery == "heatmap") {
    data = {} // Insert default values heree in production
  } else {
    var rows;
    $.ajax({
      type: "GET",
      url: '', // Insert file name for all transaction data here in production
      dataType: "text",
      success: function(data) {
        rows = processData(data);
      }
    });
    function processData(allText) {
      // Split by either Windows/Mac OSX line break
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];

      for (var i=1; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          if (data.length == headers.length) {
              var tarr = [];
              for (var j=0; j<data.length; j++) {
                  tarr.push(data[j]);
              }
              lines.push(tarr);
          }
      }
      return lines;
    }
    for (var i=0; i<rows.length; i++) {
      var tempPostalCode = rows[i][13];
      if (tempPostalCode === postalCode) {
        // Insert data values here in production
        break;
      }

    }
  }

  if (typeof(data) == 'undefined') {
    alert('No such postal code exists! Please try again.');
    return;
  }
  data = JSON.stringify(data);
  var params = {
    cmd: currentQuery,
    data: data
  }

  var url = "script.php";
  var settings = {
    url: url,
    data: params,
    dataType: "json",
    success: function(data) {
      result = data;
    },
    error: function(j, text, e) {
      console.log(j);
      console.log(text);
      console.log(e);
    }
  }
  $.post(settings);

  drawMap(result);
}

function drawMap(points) {
  var prob;
  if (currentQuery == "prob") {
    points = JSON.parse(points);
    prob = (parseFloat(points["Results"]["output1"]["value"]["Values"][0][1]) * 100.0).toFixed(2);
    $("#lightbox-text").text(
      "There is a " + prob + "% chance of " + propName + " being en-bloced."
    );
    $("#lightbox").show();
  } else {
    temp = points;
    points = [];
    for (var i=0; i<temp.length; i++) {
      points.push(new google.maps.LatLng(temp[i][0], temp[i][1]));
    }
    var singapore = new google.maps.LatLng(1.352083, 103.819836);

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: singapore,
      mapTypeId: google.maps.MapTypeId.HYBRID
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: points,
      map: map
    });

    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    heatmap.setMap(map);
  }
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}
