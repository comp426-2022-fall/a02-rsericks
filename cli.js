#!/usr/bin/env node
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));
if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`);
        process.exit(0);
};

var lattitude = args.n || (args.s *-1);
var longitude = args.e || (args.w *-1);
var timezone = moment.tz.guess();
if (args.t){
    timezone = args.t
}
timezone.replace("/", "%2");

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) + '&longitude=' + String(longitude) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}
const days =args.d;
if (data.daily.precipitation_hours[days]==0){
    console.log("You will not need your galoshes.");
}
else if (data.daily.precipitation_hours[days] != 0){
    console.log("You might need galoshes");
}
if (days ==0){
    console.log(" today.");
}
else if(days >1){
    console.log(" in " +days+ " days.")
}
else{
    console.log(" tomorrow.")
}
process.exit(0);