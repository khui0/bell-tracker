<script>
  import Countdown from "./lib/Countdown.svelte";
  import Toggle from "./lib/Toggle.svelte";

  import schedule from "./schedule.json";
  import delayed from "./delayed.json";

  let useDelayedSchedule = false;
  let useDarkTheme = true;

  let intervals = calculateIntervals();
  let intervalsExpiry = timeToMs("24:00");

  $: SCHOOL_START = intervals[0].from;
  $: SCHOOL_START_OFFSET = SCHOOL_START - timeToMs("00:00");
  $: SCHOOL_END = intervals[intervals.length - 1].to;

  let text = "";
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let progressed = 0;
  let total = 0;

  $: useDelayedSchedule,
    (() => {
      intervals = calculateIntervals();
    })();

  // Applies timeToMs on the schedule
  function calculateIntervals() {
    const input = useDelayedSchedule ? delayed : schedule;
    return input.intervals.map((interval) => {
      return {
        // @ts-ignore
        alias: interval.alias,
        from: timeToMs(interval.from),
        to: timeToMs(interval.to),
      };
    });
  }

  // Returns zero-indexed period
  function currentInterval(date = Date.now()) {
    const index = intervals.findIndex((interval) => {
      return date >= interval.from && date < interval.to;
    });
    return index;
  }

  function currentStatus(date = Date.now()) {
    // Recalculate intervals if the day has passed
    if (date >= intervalsExpiry) {
      intervals = calculateIntervals();
      intervalsExpiry = timeToMs("24:00");
    }
    const index = currentInterval(date);
    if (index !== -1) {
      // During period
      const interval = intervals[index];
      return {
        remaining: interval.to - date,
        total: interval.to - interval.from,
        text: (interval.alias || `Period ${index - schedule.startIndex + 1}`) + " ends in",
      };
    } else {
      if (date < SCHOOL_START) {
        // Before school
        return {
          remaining: SCHOOL_START - date,
          total: timeToMs("24:00") - SCHOOL_END + SCHOOL_START_OFFSET,
          text: "Good morning,\nSchool starts in",
        };
      } else if (date >= SCHOOL_END) {
        // After school
        const remainingToday = timeToMs("24:00") - date;
        const timeInterval = date < timeToMs("18:00") ? "afternoon" : "evening";
        return {
          remaining: remainingToday + SCHOOL_START_OFFSET,
          total: timeToMs("24:00") - SCHOOL_END + SCHOOL_START_OFFSET,
          text: `Good ${timeInterval},\nSchool starts in`,
        };
      } else {
        // Between periods
        // Index of upcoming period
        const index =
          intervals.findIndex((interval, i) => {
            return date >= intervals[i].to && date < intervals[i + 1].from;
          }) + 1;
        const interval = intervals[index];
        return {
          remaining: interval.from - date,
          total: interval.from - intervals[index - 1].to,
          text: interval.alias || `Period ${index - schedule.startIndex + 1} starts in`,
        };
      }
    }
  }

  // Converts hh:mm to milliseconds
  function timeToMs(time) {
    const now = new Date();
    const hours = time.split(":")[0];
    const minutes = time.split(":")[1];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
  }

  // Converts milliseconds to time units (hours, minutes, seconds)
  function msToUnits(ms) {
    const seconds = Math.floor(Math.abs(ms / 1000));
    const minutes = Math.floor(Math.abs(seconds / 60));
    const hours = Math.floor(Math.abs(minutes / 60));
    return {
      hours: hours,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  }

  function update() {
    const status = currentStatus();
    text = status.text;

    const remaining = msToUnits(status.remaining);
    // Not very elegant
    const remainingRounded = msToUnits(Math.ceil(status.remaining / 60000) * 60000);
    hours = remaining.hours;
    minutes = remaining.minutes;
    seconds = remaining.seconds;

    // Round up if seconds aren't being shown
    if (hours > 0) {
      hours = remainingRounded.hours;
      minutes = remainingRounded.minutes;
    }

    progressed = status.total - status.remaining;
    total = status.total;

    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
</script>

<main class="h-full flex flex-col gap-2 items-center justify-center text-center p-4">
  <h1 class="text-3xl text-wrap whitespace-pre">{text}</h1>
  <Countdown {hours} {minutes} {seconds}></Countdown>
  <progress class="progress max-w-80 m-4 shrink-0" value={progressed} max={total}></progress>
  <div
    class="absolute right-0 bottom-0 m-2 flex flex-col opacity-25 hover:opacity-100 transition-opacity"
  >
    <Toggle id="bt-dark-theme" classes="theme-controller" value="dark" bind:checked={useDarkTheme}
      >Dark Mode</Toggle
    >
    <Toggle id="bt-use-delayed" bind:checked={useDelayedSchedule}>Delayed</Toggle>
  </div>
</main>

<style>
  main {
    font-family: "Figtree", sans-serif;
  }
</style>
