<template>
  <div class="cn-chart-generator">
    <div class="cn-chart-generator-left">
      <v-card class="cn-color-scales-container">
        <ColorScales/>
      </v-card>

      <div class="cn-selected-color-scale-container">
        <SelectedColorScale/>
      </div>
    </div>
  </div>
</template>

<script>
const ColorScales = () => import('../components/chart-color-generator/ColorScales.vue');
const SelectedColorScale = () => import('../components/chart-color-generator/SelectedColorScale.vue');

export default {
  components: {
    ColorScales,
    SelectedColorScale,
  },
};

</script>

<style lang='scss'>
  .cn-chart-generator {
    padding: 24px;
    height: 100%;
  }

  .cn-chart-generator-left {
    max-width: 450px;
  }

  .cn-color-scales-container {
    background-color: white;
    padding: 24px;
    width: 100%;
    height: 275px;
    overflow: hidden;
  }

  .cn-selected-color-scale-container {
    padding: 12px 24px 24px 24px;
  }
</style>
