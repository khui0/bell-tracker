<script>
  export let id;
  export let checked;

  export let classes = "";
  export let value = "";

  checked = get();

  $: checked,
    (() => {
      localStorage.setItem(id, checked ? "true" : "false");
    })();

  function get() {
    return localStorage.getItem(id) === "true";
  }
</script>

<label class="label cursor-pointer gap-2">
  <span class="label-text"><slot /></span>
  <input type="checkbox" {value} class="toggle {classes}" bind:checked />
</label>
