<script>
export let sendMessageToPlugin;

let interval = 1000
let activeWindowName = undefined
let activeWindowTitle = undefined
let pageActivatorCriteria_0 = ''
let pageActivatorCriteria_1 = ''
let pageActivatorCriteria_2 = ''
let pageActivatorCriteria_3 = ''

function saveData(){
  sendMessageToPlugin(
    0,
    {
      interval,
      pageActivatorCriteria_0,
      pageActivatorCriteria_1,
      pageActivatorCriteria_2,
      pageActivatorCriteria_3,
    }
  )
}

$: interval, pageActivatorCriteria_0, pageActivatorCriteria_1, pageActivatorCriteria_2, pageActivatorCriteria_3, saveData()
</script>
<div class="p-4 bg-secondary rounded-lg flex flex-col mb-4">
    <div class="flex flex-col">
      <div class="pb-2">Page Activator</div>
      <div class="flex py-2 text-white items-center">
        <div class="mx-1">Poll interval</div>
        <input
          class="bg-primary m-1"
          type="range"
          min="200"
          max="2000"
          step="50"
          bind:value={interval}
        />
        <div class="mx-1">
          {interval} ms
        </div>
      </div>

      <div class="text-gray-400 py-1 mt-1 text-sm">
        <b>Active window:</b>
        {activeWindowName ?? "N/A"}
      </div>

      <div class="text-gray-400 py-1 mt-1 text-sm">
        <b>Active title:</b>
        {activeWindowTitle ?? "N/A"}
      </div>

      <input
        type="text"
        placeholder="Page 0 trigger application"
        class="bg-primary my-1"
        bind:value={pageActivatorCriteria_0}
      />
      <input
        type="text"
        placeholder="Page 1 trigger application"
        class="bg-primary my-1"
        bind:value={pageActivatorCriteria_1}
      />
      <input
        type="text"
        placeholder="Page 2 trigger application"
        class="bg-primary my-1"
        bind:value={pageActivatorCriteria_2}
      />
      <input
        type="text"
        placeholder="Page 3 trigger application"
        class="bg-primary my-1"
        bind:value={pageActivatorCriteria_3}
      />
    </div>
  </div>