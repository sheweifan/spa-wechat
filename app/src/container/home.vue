<template>
  <div>
    <div>home</div>
    <div v-if="userinfo">
      <div>nickname: {{userinfo.nickname}}</div>
      <div>city: {{userinfo.city}}</div>
    </div>
    <router-link to="share">
      share
    </router-link>
    <br/>
    <router-link to="share2">
      share2
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'userinfo'
    ])
  }
}
</script>

<style>
</style>
