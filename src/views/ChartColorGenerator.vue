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

    <div class="cn-chart-generator-far-right">
      <v-btn flat color="primary" @click="refreshData">Randomize Data</v-btn>
      <v-btn flat color="primary" @click="addData">Add Data Point</v-btn>
      <v-btn flat color="error" @click="removeData">Remove Data Point</v-btn>
    </div>
  </div>
</template>

<script>
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

    let rangeInfo = {
      start: 0, 
      end: 1,
      useEndAsStart: false,
    };
    
    this.pieChart = createChart('pie-chart', this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
  },
  methods: {
    initializeData() {
      this.dataValues = [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000, 18000, 28000, 30000, 15000];
    },
    refreshData() {
      this.dataValues = [];
      let dataLength = this.getRandomNumber(2, 20);
      let i, randomNumber;
      for (i = 0; i < dataLength; i++) {
        randomNumber = this.getRandomNumber(2000, 30000);
        this.dataValues.push(randomNumber);
      }
      updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    },
    addData() {
      this.dataValues.push(this.getRandomNumber(3000, 100000));
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
    }
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
    randomLabels() {
      this.dataValues.forEach((value, i) => {
        this.labelValues.push(`Test ${i}`);
      });
      return this.labelValues;
    },
    chartData() {
      return {
        data: this.dataValues,
        labels: this.randomLabels,
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
      handler: function () {
        updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
    '$store.getters.end': {
      handler: function () {
        console.log('getting fired');
        updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
  },
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

  .cn-chart-generator-far-right {
    max-width: 200px;
    justify-content: flex-end;
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
