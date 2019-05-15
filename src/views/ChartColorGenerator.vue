<template>
  <div class="cn-chart-generator">

    <!-- LEFT -->
    <div class="cn-chart-generator-left">
      <p><span>codeNebula</span> <span> presents</span></p>
      <p>Generating Chart Colors with D3 & ChartJS</p>

      <div style="display: flex; align-items: flex-start; flex-wrap: wrap; justify-content: center; margin-top: 48px;">
        <div class="cn-colored-pie-chart" style="flex: 1;">
          <canvas width="100%" height="100%" id="pie-chart"></canvas>
        </div>

        <div class="cn-colors-container" style="min-width: 300px;">
          <p>Copy All Colors</p>
          <div class="cn-colors">
            <div v-for="color in colors"
              class="cn-color-block-container"
              :key="color">
              <div class="cn-color-block" :style="`background-color: ${color}`">
              </div>
              <p>{{ color }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- RIGHT -->
    <div class="cn-chart-generator-right">
      <div class="cn-chart-actions">
        <p>ACTIONS</p>
        <v-btn flat color="primary" @click="refreshData">Randomize Data</v-btn>
        <v-btn flat color="primary" @click="addData">Add Data Point</v-btn>
        <v-btn flat color="error" @click="removeData">Remove Data Point</v-btn>
      </div>


      <p class="cn-chart-instruction">
        <v-btn icon class="cn-chart-instruction-number">1</v-btn>
        CHOOSE D3 COLOR SCALE
      </p>
      <div class="cn-color-scales-container">
        <ColorScales/>
      </div>

      <p class="cn-chart-instruction">
        <v-btn icon class="cn-chart-instruction-number">2</v-btn>
        CHOOSE COLOR SCALE RANGE
      </p>
      <div class="cn-selected-color-scale-container cn-color-control-container">
        <SelectedColorScale/>
      </div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3';

import { dollarFormat } from '../utils/dollarFormat';
import { createChart, updateChart } from '../utils/pie-chart';

const ColorScales = () => import('../components/chart-color-generator/ColorScales.vue');
const SelectedColorScale = () => import('../components/chart-color-generator/SelectedColorScale.vue');


export default {
  components: {
    ColorScales,
    SelectedColorScale,
  },
  data() {
    return {
      pieChart: {},
      dataValues: [],
      labelValues: [],
      dataCSV: '',
      labelCSV: '',
    };
  },
  mounted() {
    this.initializeData();
    setTimeout(() => {
      this.pieChart = createChart('pie-chart', this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    }, 500);
    
  },
  methods: {
    initializeData() {
      this.dataValues = [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000,
        18000, 28000, 30000, 15000];
    },
    refreshData() {
      this.dataValues = [];
      const dataLength = this.getRandomNumber(2, 20);
      let i;
      let randomNumber;
      // eslint-disable-next-line
      for (i = 0; i < dataLength; i++) {
        randomNumber = this.getRandomNumber(2000, 30000);
        this.dataValues.push(randomNumber);
      }
      updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    },
    addData() {
      this.dataValues.push(this.getRandomNumber(2000, 30000));
      updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    },
    removeData() {
      const dataLength = this.dataValues.length;
      const removeIndex = this.getRandomNumber(0, dataLength - 1);
      this.dataValues.splice(removeIndex, 1);
      this.labelValues.splice(removeIndex, 1);
      updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    },
    getRandomNumber(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    randomLabels() {
      this.dataValues.forEach((value, i) => {
        this.labelValues.push(`Test ${i}`);
      });
      return this.labelValues;
    },
  },
  computed: {
    scaleName() {
      return this.$store.getters.scale;
    },
    start() {
      return this.$store.getters.start;
    },
    end() {
      return this.$store.getters.end;
    },
    colors() {
      const colors = [];
      const dataLength = this.dataValues.length;
      let i;
      let color;
      // eslint-disable-next-line
      for (i = 0; i < dataLength; i++) {
        color = this.start + (i * ((this.end - this.start) / dataLength));
        colors.push(d3.color(d3[`interpolate${this.scaleName}`](color)).hex());
      }
      return colors;
    },
    chartData() {
      return {
        data: this.dataValues,
        labels: this.randomLabels(),
      };
    },
    rangeInfo() {
      return {
        start: this.start,
        end: this.end,
        useEndAsStart: false,
      };
    },
  },
  watch: {
    '$store.getters.scale': {
      // eslint-disable-next-line
      handler: function (scaleName) {
        updateChart(this.pieChart, scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
    '$store.getters.start': {
      // eslint-disable-next-line
      handler: function () {
        updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
    '$store.getters.end': {
      // eslint-disable-next-line
      handler: function () {
        updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
  },
};

</script>

<style lang='scss'>

  /* LAYOUT */
  .cn-chart-generator {
    height: 100%;
    display: flex;
    overflow: hidden;
  }

  .cn-chart-generator-left,
  .cn-chart-generator-right {
    height: calc(100% - 1px);
    overflow-y: auto;
    padding: 24px;
  }

  .cn-chart-generator-left {
    flex: 1;
  }

  .cn-chart-generator-right {
    background-color: #f1f1f1;
    width: 400px;
  }


  /* INSTRUCTIONS */
  .cn-chart-instruction {
    display: flex;
    align-items: center;
    margin: 24px 0px 12px;
  }

  .cn-chart-instruction-number {
    background-color: #b9cdff !important;
    color: #5355ff !important;
    font-weight: 600;
    pointer-events: none;
    margin: 0px 6px 0 0;
  }

  
  /* LIST OF COLOR SCALES */
  .cn-color-scales-container {
    background-color: white;
    padding: 24px;
    width: 100%;
    height: 275px;
    overflow: hidden;
  }

  .cn-color-control-container {
    background-color: white;
    padding: 24px;
  }

  /* SLIDER */
  .cn-selected-color-scale-container {
    padding: 24px;
  }

  .cn-colored-pie-chart {
    width: 100% !important;
  }

  #pie-chart {
    max-width: 400px;
    margin: 0 auto;
  }

  .cn-colors-container {
    margin: 24px;
  }

  .cn-colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cn-color-block-container {
    display: flex;
    align-items: center;
    margin: 0 24px 24px 0;

    p {
      margin-bottom: 0px;
    }
  }

  .cn-color-block {
    height: 24px;
    width: 24px;
    display: inline-block;
    margin-right: 12px;
  }
</style>
