var schedule;
var from = [];
var to = [];

const primary = document.getElementById("primary");
const secondary = document.getElementById("secondary");

document.body.className = localStorage.getItem("bell-theme") || "";

fetch("bell-schedule.json").then(res => {
    res.json().then(json => {
        schedule = json;
        for (let i = 0; i < schedule.length; i++) {
            from.push(timeToMs(schedule[i].from));
            to.push(timeToMs(schedule[i].to));
        }
    });
});

setInterval(() => {
    if (schedule) {
        primary.textContent = getStatus()[0];
        secondary.textContent = getStatus()[1];
    }
}, 500);

function getStatus() {
    // let now = timeToMs("08:38");
    let now = new Date();
    for (let i = 0; i < schedule.length; i++) {
        if (i == 0 && now < from[i]) {
            return ["before school", ""];
        }
        else if (i == schedule.length - 1 && now >= to[i]) {
            return ["after school", ""];
        }
        if (now >= from[i] && now < to[i]) {
            return [`it's currently period ${i + 1}`, `${msToMinutes(to[i] - now)} left`];
        }
        if (now >= to[i - 1] && now < from[i]) {
            return [`between periods ${i} and ${i + 1}`, `next period starts in ${msToMinutes(from[i] - now)}`];
        }
    }
}

// converts hh:mm string to time in ms
function timeToMs(time) {
    let now = new Date();
    let array = time.split(":");
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), array[0], array[1]).getTime();
}

// converts ms to string in minutes
function msToMinutes(ms) {
    let value = Math.ceil(ms / 60000);
    if (value == 1) {
        return `${value} minute`;
    }
    else {
        return `${value} minutes`;
    }
}

document.querySelector("[data-toggle]").addEventListener("click", e => {
    let value = document.body.className ? "" : e.target.getAttribute("data-toggle");
    document.body.className = value;
    localStorage.setItem("bell-theme", value);
});