var schedule;
var from = [];
var to = [];

const text = document.querySelector("h1");

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
        text.textContent = getPeriod();
    }
}, 500);

function getPeriod() {
    // let now = timeToMs("08:38");
    let now = new Date();
    for (let i = 0; i < schedule.length; i++) {
        if (i == 0 && now < from[i]) {
            return "before school";
        }
        else if (i == schedule.length - 1 && now >= to[i]) {
            return "after school";
        }
        if (now >= from[i] && now < to[i]) {
            return `it's currently period ${i + 1}`;
        }
        if (now >= to[i - 1] && now < from[i]) {
            return `between periods ${i} and ${i + 1}`;
        }
    }
}

// converts hh:mm string to time in ms
function timeToMs(string) {
    let now = new Date();
    let array = string.split(":");
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), array[0], array[1]).getTime();
}