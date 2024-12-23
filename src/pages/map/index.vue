<template>
  <div class="container">
    <gaodeMap />
  </div>
</template>
<script>
import gaodeMap from './components/gaodeMap.vue'
export default {
  components: {
    gaodeMap
  },
  data() {},
  mounted() {

  }
}
</script>
<style>
.container {
    height: 100vh;
}
</style>
