<script>
  export let hours;
  export let minutes;
  export let seconds;

  import pluralize from "pluralize";
</script>

<p class="text-3xl sm:text-6xl">
  {#if hours > 0}
    <span class="countdown font-mono">
      <span style="--value:{hours};"></span>
    </span>
    {pluralize("hour", hours, false)}
  {/if}
  {#if minutes > 0}
    <span class="countdown font-mono">
      <span style="--value:{minutes};"></span>
    </span>
    {pluralize("minute", minutes, false)}
  {/if}
  {#if hours == 0}
    <span class="countdown font-mono">
      <span style="--value:{seconds};"></span>
    </span>
    {pluralize("second", seconds, false)}
  {/if}
</p>
