<script setup>
  import {ref, reactive} from 'vue'

  const countRef = ref(10)
  const countReactive = reactive(10)

  watchEffect(() => {
    console.log('countRef', countRef)
    console.log('countReactive', countReactive)
  })
</script>