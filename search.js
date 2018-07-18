'use strict';

var host = window.location.host;
var ws = new WebSocket('ws://'+host+'/ws');
var $message = $('#message');

var $resultsDiv = $('#results');
var $form = $('#form');
$resultsDiv.hide();

ws.onopen = function(){
    $message.attr("class", 'label label-success');
    $message.text('open');
};
ws.onmessage = function(ev){
    $message.attr("class", 'label label-info');
    $message.hide();
    $message.fadeIn("slow");
    $message.text('recieved message');
    console.log(ev.data);

    var json = JSON.parse(ev.data);
    var value = json.value
    var html="<h2>Found it!</h2>";
    html += "<br/>";
    html += "<h1><code>" + value + "</code></h1>";
    $resultsDiv.html(html);
};
ws.onclose = function(ev){
    $message.attr("class", 'label label-important');
    $message.text('closed');
};
ws.onerror = function(ev){
    $message.attr("class", 'label label-warning');
    $message.text('error occurred');
};



$form.on('submit', function() {
    var html = '<img src="img/giphy.gif" alt="Loading..." />';
    //var query = queryInput.val();
    $resultsDiv.html(html);
    $resultsDiv.show();
    //displayResult(query);
    displayResult();
    return false;
});

function displayResult(query) {
    ws.send(query);
}
