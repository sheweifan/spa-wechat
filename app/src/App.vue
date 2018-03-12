<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  created () {
    this.$store.dispatch('updateUserinfo', {
      username: 'fuck'
    })
  }
}
</script>

<style>
#app {
}
</style>
