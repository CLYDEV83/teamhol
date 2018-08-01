import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

//import * as ical from './icalService';

$(function () {

    //const url = 'https://freestyleinteractivelimited.breathehr.com/VKkxaKO7HALM2XyMbkJsgBvDmudzoWuLHynC1aP560w/1192/calendar.ics';
    //ical.main({ url: url });


    // Refresh.

    var refreshEverySoMinutes = 30;

    var minute = new Date().getMinutes(),
        nextRefresh = (refreshEverySoMinutes - (minute % refreshEverySoMinutes)) * 60 * 1000;

    setTimeout(function () { location.reload(); }, nextRefresh);

});