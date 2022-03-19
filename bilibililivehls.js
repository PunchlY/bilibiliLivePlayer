// ==UserScript==
// @name         BiliBili直播-白嫖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直播白嫖
// @author       punchly
// @match        https://punchly.github.io/hlsplayer/
// @icon         https://www.bilibili.com/favicon.ico
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function () {
    $('body').prepend("<div id='search'>");
    $('#search').prepend("<input name='search' type='button' id='display' value='/\\'>");
    $(function () {
        $('body').on('click', "#display", function () {
            $("#search_response").toggle();
            if ($('#search_response').css('display') == 'none') {
                $("#display").attr("value", '\\/');
            } else {
                $("#display").attr("value", '/\\');
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
    $('#search_request').append("<input name='search' type='radio' id='room' value='live_room' checked='checked'>room");
    $('#search_request').append("<input name='search' type='radio' id='user' value='live_user'>user");
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
            random();
        });
    });
    random();
    $('body').append("<div id='out'>");
})();

function search(key, type, page) {
    if (key == '' || type == '' || page == '') return false;
    $("#search_response").empty();
    $('#search_response').append("<div id='islive'>")
    $('#search_response').append("<div id='dislive'>")
    GM_xmlhttpRequest({
        method: "get",
        url: `http://api.bilibili.com/x/web-interface/search/type?search_type=${type}&keyword=${key}&page=${page}`,
        onload: function (res) {
            let json = JSON.parse(res.responseText);
            let data = json.data;
            $("#page").attr("max", data.numPages)
            data.result.forEach(function (element) {
                if (element.live_status) {
                    $('#islive').append('<p>');
                    $('#islive').append(`<input name='play' type='radio' id=${element.roomid} value=${element.roomid}>`);
                    $('#islive').append(`<small><b>[live]</b></small> ${element.title}-<small>[${element.tags}]</small> <sub><b>${element.uname}</b> <sup>[${element.cate_name}]</sup></sub>`);
                }
                else {
                    $('#dislive').append('<p>');
                    $('#dislive').append(`<small><b>[X]</b></small>${element.uname} ${element.cate_name}`);
                }
            });
        }
    });
}

function random() {
    $("#search_response").empty();
    $('#search_response').append("<div id='getRecommendList'>")
    $('#getRecommendList').append('<p><b>Recommend List:</b>');
    GM_xmlhttpRequest({
        method: "get",
        url: 'https://api.live.bilibili.com/relation/v1/AppWeb/getRecommendList',
        onload: function (res) {
            let json = JSON.parse(res.responseText);
            let data = json.data;
            data.list.forEach(function (element) {
                $('#getRecommendList').append('<p>');
                $('#getRecommendList').append(`<input name='play' type='radio' id=${element.roomid} value=${element.roomid}>`);
                $('#getRecommendList').append(`<small><b>[live]</b></small>${element.roomname}<sub><b>${element.nickname}</b></sub>`);
            });
        }
    });
    $('#search_response').append("<div id='getList'>")
    $('#getList').append('<p><b>platform=web:</b>');
    GM_xmlhttpRequest({
        method: "get",
        url: 'https://api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web',
        onload: function (res) {
            let json = JSON.parse(res.responseText);
            let data = json.data;
            data.recommend_room_list.forEach(function (element) {
                $('#getList').append('<p>');
                $('#getList').append(`<input name='play' type='radio' id=${element.roomid} value=${element.roomid}>`);
                $('#getList').append(`<small><b>[live]</b></small>${element.title} <sub><b>${element.uname}</b> <sup>${element.area_v2_parent_name}-${element.area_v2_name}</sup></sub>`);
            });
        }
    });
}
$(function () {
    $('body').on('click', ":radio[name=play]", function () {
        $('#display').click();
        $("#out").empty();
        let room_id = $(':radio[name="play"]:checked').val();
        //chat(room_id);
        GM_xmlhttpRequest({
            method: "get",
            url: `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?protocol=0,1&format=0,1,2&codec=0,1&platform=h5&ptype=8&room_id=${room_id}`,
            onload: function (res) {
                let json = JSON.parse(res.responseText);
                let data = json.data;
                $('#out').append("<div id='qn'>")
                $('#out').append("<div id='line'>")
                data.playurl_info.playurl.stream[0].format[0].codec[0].accept_qn.forEach(function (accept_qn) {
                    $('#qn').append('<p>');
                    $('#qn').append(`<input name='qn' type='radio' id=${accept_qn} value=${accept_qn}>${accept_qn}`);
                });
            }
        });
        $('body').on('click', ":radio[name=qn]", function () {
            $("#line").empty();
            geturl(room_id, $(':radio[name="qn"]:checked').val());
        });
    });
    function geturl(room_id, qn) {
        GM_xmlhttpRequest({
            method: "get",
            url: `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?protocol=0,1&format=0,1,2&codec=0,1&platform=h5&ptype=8&room_id=${room_id}&qn=${qn}`,
            onload: function (res) {
                let json = JSON.parse(res.responseText);
                let data = json.data;
                data.playurl_info.playurl.stream.forEach(function (stream_info) {
                    if (stream_info.format[0].format_name == 'ts') {
                        let base_url = stream_info.format.slice(-1)[0].codec[0].base_url;
                        let url_info = stream_info.format.slice(-1)[0].codec[0].url_info;
                        url_info.forEach(function (info, index) {
                            $('#line').append('<p>');
                            $('#line').append(`<input name='line' type='radio' id='line_${index}' value=${info.host}${base_url}${info.extra}>line[${index}]`);
                        });
                    }
                });
                $('body').on('click', ":radio[name=line]", function () {
                    console.log($(':radio[name="line"]:checked').val());
                });
            }
        });
    }
})