<script>
  export let checked;
</script>

<div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text"><slot /></span>
    <input type="checkbox" class="toggle" bind:checked />
  </label>
</div>
