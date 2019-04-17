<template>
  <v-app>
    <div class="cn-demos">
      <router-view/>
    </div>
  </v-app>
</template>

<script>

export default {
  name: 'App',
};

</script>

<style>
  body, html, .application {
    height: 100%;
  }

  .cn-demos {
    background-color: white;
    height: 100%;
  }
</style>
