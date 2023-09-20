import "./reset.css";
import "./style.css";

import pluralize from "pluralize";

import schedule from "./schedule.json";

const TWENTY_FOUR_HOURS = 8.64e7;

const titles = schedule.map(item => item.title);
const from = schedule.map(item => timeToMs(item.from));
const to = schedule.map(item => timeToMs(item.to));

const primary = document.getElementById("primary");
const secondary = document.getElementById("secondary");

function update() {
    const now = Date.now();
    // const now = timeToMs("6:30");
    const after = from.findLastIndex(time => now > time);
    const before = to.findIndex(time => now < time);
    // console.log(after, before);

    // Before school
    if (after == -1) {
        const time = unitsToString(msToUnits(from[0] - now));
        primary.textContent = "Before school";
        secondary.textContent = `School starts in ${time}`;

        setProgress(getPercentage(to[to.length - 1] - TWENTY_FOUR_HOURS, from[0], now));
    }
    // After school
    else if (before == -1) {
        const time = unitsToString(msToUnits(from[0] + TWENTY_FOUR_HOURS - now));
        primary.textContent = "After school";
        secondary.textContent = `School starts in ${time}`;

        setProgress(getPercentage(to[to.length - 1], from[0] + TWENTY_FOUR_HOURS, now));
    }
    // During period
    else if (after == before) {
        const time = unitsToString(msToUnits(to[after] - now));
        primary.textContent = titles[after];
        secondary.textContent = `Ends in ${time}`;

        setProgress(getPercentage(from[after], to[after], now));
    }
    // Between periods
    else if (after < before) {
        const time = unitsToString(msToUnits(from[after + 1] - now));
        primary.textContent = `${titles[after]} > ${titles[before]}`;
        secondary.textContent = `Starts in ${time}`;

        setProgress(getPercentage(to[after], from[after + 1], now));
    }

    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

// Converts hh:mm to milliseconds
function timeToMs(time) {
    const now = new Date();
    const hours = time.split(":")[0];
    const minutes = time.split(":")[1];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
}

// Calculates hours, minutes, and seconds from milliseconds
function msToUnits(ms) {
    const seconds = Math.floor(Math.abs(ms / 1000));
    const minutes = Math.floor(Math.abs(seconds / 60));
    const hours = Math.floor(Math.abs(minutes / 60));
    return {
        hours: hours,
        minutes: minutes % 60,
        seconds: seconds % 60,
    }
}

// Converts msToUnits return value to string
function unitsToString(units) {
    if (units.hours > 0) {
        if (units.minutes > 0) {
            units.hours++;
        }
        return pluralize("hour", units.hours, true);
    }
    else if (units.minutes > 0) {
        if (units.seconds > 0) {
            units.minutes++;
        }
        return pluralize("minute", units.minutes, true);
    }
    else {
        return pluralize("second", units.seconds, true);
    }
}

// Fills progress bar to a specified percentage
function setProgress(percentage) {
    const fill = document.querySelector("#bar>div");
    fill.style.width = percentage + "%";
}

// Gets percentage between two values
function getPercentage(start, end, current) {
    return (current - start) / (end - start) * 100;
}