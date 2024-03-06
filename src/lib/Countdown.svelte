<script>
  export let hours;
  export let minutes;
  export let seconds;

  import pluralize from "pluralize";
</script>

<div class="flex gap-5 text-6xl">
  {#if hours > 0}
    <div>
      <span class="countdown font-mono">
        <span style="--value:{hours};"></span>
      </span>
      {pluralize("hour", hours, false)}
    </div>
  {/if}
  {#if minutes > 0}
    <div>
      <span class="countdown font-mono">
        <span style="--value:{minutes};"></span>
      </span>
      {pluralize("minute", minutes, false)}
    </div>
  {/if}
  {#if hours == 0 && minutes == 0}
    <div>
      <span class="countdown font-mono">
        <span style="--value:{seconds};"></span>
      </span>
      {pluralize("second", seconds, false)}
    </div>
  {/if}
</div>
