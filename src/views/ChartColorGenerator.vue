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

    <div class="cn-chart-generator-right">
      <div class="cn-colored-pie-chart">
        <canvas id="pie-chart"></canvas>
      </div>
    </div>
    
  </div>
</template>

<script>
import { dollarFormat } from '../utils/dollarFormat';
import { createChart, updateChart } from '../utils/pie-chart';

const ColorScales = () => import('../components/chart-color-generator/ColorScales.vue');
const SelectedColorScale = () => import('../components/chart-color-generator/SelectedColorScale.vue');


const chartData = {
  labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test 8', 'Test 9', 'Test 10', 'Test 11', 'Test 12'],
  data: [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000, 18000, 28000, 30000, 15000],
};


export default {
  components: {
    ColorScales,
    SelectedColorScale,
  },
  data() {
    return {
      pieChart: {},
    };
  },
  mounted() {
    let rangeInfo = {
      start: 0, 
      end: 1,
      useEndAsStart: false,
    };
    this.pieChart = createChart('pie-chart', this.scaleName, chartData, rangeInfo, dollarFormat);
  },
  computed: {
    scaleName() {
      return this.$store.getters.scale;
    },
  },
  watch: {
    '$store.getters.scale': {
      // eslint-disable-next-line
      handler: function (scaleName) {
        let rangeInfo = {
          start: 0, 
          end: 1,
          useEndAsStart: false,
        };
        updateChart(this.pieChart, scaleName, chartData, rangeInfo, dollarFormat);
      },
    }
  }
  
};

</script>

<style lang='scss'>
  .cn-chart-generator {
    padding: 24px;
    height: 100%;
    display: flex;
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


  .cn-colored-pie-chart {
    max-width: 600px;
    max-height: 500px;
  }

  #pie-chart {
    width: 100% !important;
  }
</style>
