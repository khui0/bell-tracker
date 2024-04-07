<script>
  export let id;
  export let checked;

  checked = get();

  $: checked,
    (() => {
      localStorage.setItem(id, checked ? "true" : "false");
    })();

  function get() {
    return localStorage.getItem(id) === "true";
  }
</script>

<div class="form-control">
  <label class="label cursor-pointer gap-2">
    <span class="label-text"><slot /></span>
    <input type="checkbox" class="toggle" bind:checked />
  </label>
</div>
