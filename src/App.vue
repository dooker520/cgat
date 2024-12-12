<template>
  <div id="app">
    <QuickReplies />
  </div>
</template>

<script>
import QuickReplies from './components/QuickReplies.vue';

export default {
  components: {
    QuickReplies,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>