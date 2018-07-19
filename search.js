'use strict';

var host = window.location.host;
var ws = new WebSocket('ws://'+host+'/ws');

var $message = $('#message');
var $resultsDiv = $('#results');
var $form = $('#form');
var $button = $('#button');
var $progressDiv = $('#myProgress');
var $bar = $('#myBar');
var $connexions = $('#connexions');


$resultsDiv.hide();
$progressDiv.hide();

ws.onopen = function(){
    $message.attr("class", 'label label-success');
    $message.text('open');
};

ws.onmessage = function(ev){
    var json = JSON.parse(ev.data);
    if (json.type == 'progress_update') {
        updateBar(json.value);
    }
    if (json.type == 'nb_clients') {
        updateClient(json.value);
    }
    else if (json.type == 'result') {
        displayResult(json.value);
    }
};
ws.onclose = function(ev){
    $message.attr("class", 'label label-important');
    $message.text('closed');
};
ws.onerror = function(ev){
    $message.attr("class", 'label label-warning');
    $message.text('error occurred');
};



$button.on('click', function() {
    $resultsDiv.hide();
    //var query = queryInput.val();
    //ws.send(query);
    ws.send("");
    return false;
});

function displayResult(value) {
    var html = "<h1><code>" + value + "</code></h1>";
    $resultsDiv.hide();
    $resultsDiv.fadeIn("slow");
    $resultsDiv.html(html);
}

function updateBar(percentage) {
    $progressDiv.show();
    $bar.width( percentage + '%');
    if (percentage == 100) {
        $progressDiv.hide();
    }
}

function updateClient(nb_clients) {
    $connexions.text(nb_clients);
}
