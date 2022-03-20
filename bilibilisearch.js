//

var newscript = document.createElement('script');
newscript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.head.appendChild(newscript);

function main() {
$('#search').prepend("<input name='search' type='button' id='display' value='close'>");
$(function () {
    $("#live").hide();
    $('body').on('click', "#display", function () {
        $("#search_response").toggle();
        $("#live").toggle();
        $("#live").toggle();
        if ($('#search_response').css('display') == 'none') {
            $("#display").attr("value", 'open');
        } else {
            $("#display").attr("value", 'close');
        }
    });
});
$('#display').after("<input name='search' type='button' id='remove' value='X'>");
$(function () {
    $('body').on('click', "#remove", function () {
        $("#search").remove();
    });
});
$('#search').append("<div id='search_request'>");
$('#search_request').append("<input name='search' type='text' id='key' placeholder='search'>");
$('#search_request').append("<input name='search' type='radio' value='live_room' checked='checked'>room");
$('#search_request').append("<input name='search' type='radio' value='live_user'>user");
$('#search_request').append("<input name='search' type='number' id='page' placeholder='page' value='1' min='1' max='1'>");
$(function () {
    $('#key').on('keypress', function (event) {
        if (event.keyCode == '13') {
            $("#page").val('1');
            search($("#key").val(), $(':radio[name="search"]:checked').val(), 1);
        }
    })
    $('body').on('click', ":radio[name=search]", function () {
        $("#page").val('1');
        search($("#key").val(), $(':radio[name="search"]:checked').val(), 1);
    });
    $('#page').on('input', function (event) {
        search($("#key").val(), $(':radio[name="search"]:checked').val(), $('#page').val());
    })
});
$('#search').append("<div id='search_response'>");
$('#search_request').append("<input name='search' type='button' id='random' value='random'>");
$(function () {
    $('body').on('click', "#random", function () {
        if ($('#search_response').css('display') == 'none') $('#display').click();
        random();
    });
});
random();
$('#search').append("<div id='out'>");}