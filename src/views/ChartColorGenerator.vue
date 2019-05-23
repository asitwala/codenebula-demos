<template>
  <div class="cn-chart-generator">

    <!-- LEFT -->
    <div class="cn-chart-generator-left">
      <p>
        <a class="cn-link"
          href="https://codenebula.io/demos">
          <span class="cn-logo">code<span class="cn-logo-divider">N</span>ebula
          </span>
        </a>
        <span class="cn-presents"> presents</span>
      </p>
      <h1>Generating Chart Colors with
        <a class="cn-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/d3/d3-scale-chromatic">
          D3
        </a>&
        <a class="cn-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.chartjs.org/">
          ChartJS
        </a>
      </h1>

      <div class="cn-chart-generator-results">
        <div class="cn-colored-pie-chart">
          <canvas width="100%" height="100%" id="pie-chart"></canvas>
        </div>

        <div class="cn-colors-container">
          <div>
            <div class="cn-color-copy-meta">
               <div class="cn-color-copy-scale-name">
                <v-icon>fas fa-star</v-icon>
                interpolate{{ scaleName }}
              </div>
              <v-chip>{{ dataLength }} DATA POINTS</v-chip>
            </div>

            <v-tooltip
              left
              top
              :value="colorsStringCopied"
              :disabled="!colorsStringCopied"
            >
              <div
                slot="activator"
                @click="copyColorsString()"
                @mouseout="clearColorsStringCopy()"
                class="cn-color-copy-all">
                <v-icon>fas fa-copy</v-icon>
                Copy All Color Codes
              </div>
              <span>Copied!</span>
            </v-tooltip>

            <div class="cn-color-copy-subtext">
              Or click on a color below to copy a specific color code
              <input
                id="colors-string"
                class="cn-color-input"
                :value="colorsString"/>
            </div>
          </div>

          <div class="cn-colors">
            <v-tooltip
              v-for="(color, index) in colors"
              :key="`${color}-${index}`"
              top
              :value="colorCopied === `${color}-${index}`"
              :disabled="colorCopied !== `${color}-${index}`">
              <div
                slot="activator"
                @click="copyColor(color, index)"
                @mouseout="clearCopy()"
                class="cn-color-block-container">
                <div class="cn-color-block" :style="`background-color: ${color}`"></div>
                <p>{{ color }}</p>
                <input class="cn-color-input" :value="color"
                  :id="`${color}-${index}`" />
              </div>
              <span>Copied!</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="cn-chart-generator-right">
      <div class="cn-chart-generator-right-container">

        <div class="cn-chart-actions">
          <p class="cn-chart-instruction">
            <v-btn icon
              class="cn-chart-instruction-btn cn-chart-instruction-icon">
              <v-icon>fas fa-tools</v-icon>
            </v-btn>
            ACTIONS
          </p>
          <v-btn flat color="primary" @click="refreshData">Randomize Data</v-btn>
          <v-btn flat color="primary" @click="addData">Add Data Point</v-btn>
          <v-btn flat color="error" @click="removeData">Remove Data Point</v-btn>
        </div>


        <p class="cn-chart-instruction">
          <v-btn icon
            class="cn-chart-instruction-btn cn-chart-instruction-icon">
            <v-icon>fas fa-paint-brush</v-icon>
          </v-btn>
          CHOOSE D3 COLOR SCALE
        </p>
        <div class="cn-color-scales-container">
          <ColorScales/>
        </div>

        <p class="cn-chart-instruction" style="margin-top: 36px">
          <v-btn icon
            class="cn-chart-instruction-btn cn-chart-instruction-icon">
            <v-icon>fas fa-sliders-h</v-icon>
          </v-btn>
          CHOOSE COLOR SCALE RANGE
        </p>
        <div class="cn-selected-color-scale-container cn-color-control-container">
          <SelectedColorScale/>
        </div>
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
      colorCopied: '',
      colorsStringCopied: false,
    };
  },
  mounted() {
    this.initializeData();
    setTimeout(() => {
      this.pieChart = createChart('pie-chart', this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
    }, 500);
  },
  methods: {
    copyColor(color, index) {
      const colorInput = document.getElementById(`${color}-${index}`);
      colorInput.select();
      document.execCommand('copy');
      this.colorCopied = `${color}-${index}`;
    },
    clearCopy() {
      this.colorCopied = '';
    },
    copyColorsString() {
      const colorsStringInput = document.getElementById('colors-string');
      colorsStringInput.select();
      document.execCommand('copy');
      this.colorsStringCopied = true;
    },
    clearColorsStringCopy() {
      this.colorsStringCopied = false;
    },
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
      const { dataLength } = this;
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
    useEndAsStart() {
      return this.$store.getters.useEndAsStart;
    },
    dataLength() {
      return this.dataValues.length;
    },
    colors() {
      const colors = [];
      const { dataLength } = this;
      let i;
      let color;
      // eslint-disable-next-line
      for (i = 0; i < dataLength; i++) {
        if (this.useEndAsStart) {
          color = this.end - (i * ((this.end - this.start) / dataLength));
        } else {
          color = this.start + (i * ((this.end - this.start) / dataLength));
        }
        colors.push(d3.color(d3[`interpolate${this.scaleName}`](color)).hex());
      }

      return colors;
    },
    colorsString() {
      return this.colors.join(', ');
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
        useEndAsStart: this.useEndAsStart,
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
    '$store.getters.useEndAsStart': {
      // eslint-disable-next-line
      handler: function() {
        updateChart(this.pieChart, this.scaleName, this.chartData, this.rangeInfo, dollarFormat);
      },
    },
  },
};

</script>

<style lang='scss'>

  /* LINKS */
  .cn-link {
    text-decoration: none;
    padding-bottom: 3px;
    border-bottom: 4px solid transparent;
    transition: 0.5s border ease;
    cursor: pointer;

    &:hover {
      border-bottom: 4px solid #d7e0ff;
    }
  }

  /* LOGO + HEADER */
  .cn-logo {
    font-family: 'Ubuntu', 'Open Sans', Helvetica, Arial, sans-serif;
    font-size: 16px;
    color: #576adb;

    &-divider {
      font-family: 'Acme', 'Ubuntu', 'Open Sans', Helvetica, Arial, sans-serif;
      font-size: 18px;
    }
  }

  .cn-presents {
    color: #777777;
  }

  .cn-chart-generator {
    h1 {
      font-weight: normal;
      font-size: 24px;
    }
  }

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
    min-width: 300px;
  }

  .cn-chart-generator-right {
    background-color: #f1f1f1;
    width: 400px;
  }

  .cn-chart-generator-results {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 48px;
  }


  /* PIE CHART */
  .cn-colored-pie-chart {
    width: 100% !important;
    max-width: 400px;
  }

  #pie-chart {
    max-width: 400px;
    margin: 0 auto;
  }


  /* INSTRUCTIONS */
  .cn-chart-instruction {
    display: flex;
    align-items: center;
    margin: 24px 0px 12px;
    font-weight: 600;
  }

  .cn-chart-instruction-btn {
    background-color: #b9cdff !important;
    pointer-events: none;
    margin: 0px 6px 0 0;
  }

  .cn-chart-instruction-icon i {
    font-size: 20px !important;
    color: #666ef1 !important;
  }

  /* LIST OF COLOR SCALES */
  .cn-color-scales-container {
    background-color: white;
    width: 100%;
    height: 275px;
    overflow: hidden;
  }

  /* RANGE SLIDER */
  .cn-color-control-container {
    background-color: white;
    padding: 24px;
  }

  .cn-selected-color-scale-container {
    padding: 24px;
  }

  /* Color Code Copy */
  .cn-color-copy-meta {
    margin-bottom: 24px;
    margin-left: -1px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .cn-color-copy-scale-name {
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;

    i {
      color: #ffd54f !important;
      font-size: 18px;
      margin-right: 4px;
    }
  }

  .cn-color-copy-all {
    color: #585858;
    cursor: pointer;
    margin-bottom: 8px;
    transition: 0.5 all ease;
    display: inline-block;

    i {
      color: #bbbbbb !important;
      font-size: 18px;
      margin-right: 4px;
    }

    &:hover {
      color: #576adb;
      i {
        color: #576adb !important;
      }
    }
  }

  .cn-color-copy-subtext {
    color: #777777;
    margin-bottom: 16px;
    font-size: 13px;
    font-style: italic;
  }


  /* Colors */
  .cn-colors-container {
    margin: 24px;
    flex: 1;
  }

  .cn-colors {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cn-color-block-container {
    display: flex;
    align-items: center;
    margin: 0 24px 24px 0;
    cursor: pointer;

    p {
      margin-bottom: 0px;
      transition: 0.1s all ease-in;
    }

    &:hover {
      .cn-color-block {
        opacity: 0.75;
        height: 22px;
        width: 22px;
      }

      p {
        color: #777777;
      }
    }
  }

  .cn-color-block {
    transition: 0.1s all ease-in;
    height: 24px;
    width: 24px;
    display: inline-block;
    margin-right: 12px;
  }

  .cn-color-input {
    opacity: 0;
    width: 1px !important; // must be greater than 0
  }

  /* MOBILE RESPONSIVENESS */
  @mixin for-smaller-screens {
    @media (max-width: 800px) {
      @content;
    }
  }

  @include for-smaller-screens {
    .cn-chart-generator {
      flex-wrap: wrap;
      overflow: visible;
    }

    .cn-chart-generator-left,
    .cn-chart-generator-right {
      overflow: visible;
      height: auto !important;
    }

    .cn-chart-generator-right {
      width: 100%;
      padding: 0px !important;
    }

    .cn-chart-generator-right-container {
      width: 400px;
      padding: 24px;
      margin: 0 auto;
    }
  }

  /* MOBILE RESPONSIVENESS */
  @mixin for-smaller-screens-2 {
    @media (max-width: 400px) {
      @content;
    }
  }

  @include for-smaller-screens-2 {
    .cn-colors {
      grid-template-columns: 1fr 1fr;
    }

    .cn-chart-generator-right-container {
      width: 100%;
    }

    .cn-selected-color-scale-container {
      padding: 24px 0px;
    }

    .cn-chart-generator-right-container {
      padding: 24px 0px;
    }

    .cn-chart-instruction {
      padding-left: 24px;
      padding-right: 24px;
    }
  }

</style>
