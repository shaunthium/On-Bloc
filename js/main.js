propName = "Westwood Apartments";
postalCode = "";

function showHeatmapInputs() {
  $('#div-prob').hide();
  $('#div-heatmap').show();
  currentQuery = "heatmap";
}

function showProbabilityInputs() {
  $('#div-heatmap').hide();
  $('#div-prob').show();
  currentQuery = "prob";
}

$(document).ready(function(){
  $('#btn-submit').click(function(e) {
    propName = $('#input-location').val();
    postalCode = $('#input-postal').val();
    callAPI();
    $('#btn-modal-close').click();
    e.preventDefault();
  });
});
