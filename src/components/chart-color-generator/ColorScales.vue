<template>
  <div class="cn-color-scales">
    <div v-for="scaleName in scales" :key="scaleName">
      <label>
        <v-icon
          class="cn-color-scales-selected-icon"
          v-if="selectedScale === scaleName">fas fa-star</v-icon>
        {{ `interpolate${scaleName}`}}
      </label>

      <div :class="`cn-interpolate-${scaleName}`" @click="selectScale(scaleName)">
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import COLOR_SCALES from '../../utils/colorScaleNames';


export default {
  data() {
    return {
      width: 300,
      height: 24,
      scales: COLOR_SCALES,
      selectedScale: 'Rainbow',
    };
  },
  mounted() {
    this.scales.forEach((scaleName) => {
      this.createScale(scaleName);
    });
  },
  methods: {
    /* Reference: https://bl.ocks.org/pstuffa/d5934843ee3a7d2cc8406de64e6e4ea5 */
    createScale(scaleName) {
      const { width, height } = this;
      const svg = d3.select(`.cn-interpolate-${scaleName}`)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

      // eslint-disable-next-line
      const bars = svg.selectAll('.bars')
        // eslint-disable-next-line
        .data(d3.range(width), function (d) { return d; })
        .enter().append('rect')
        .attr('class', 'bars')
        // eslint-disable-next-line
        .attr('x', function (d, i) { return i; })
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width)
        // eslint-disable-next-line
        .style('fill', function (d) { return d3['interpolate' + scaleName](0 + (d * (1/width))); });
    },
    selectScale(scaleName) {
      this.selectedScale = scaleName;
      this.$store.commit('setScale', scaleName);
    },
  },
};
</script>

<style lang='scss'>

.cn-color-scales {
  padding: 24px;
  overflow-y: auto;
  height: 100%;

  label {
    display: flex;
    margin-bottom: 4px;
  }

  svg {
    display: block;
    margin-bottom: 24px;
    cursor: pointer;
    animation-delay: 300ms;

    &:hover {
      animation: show-inner 0.5s;
      opacity: 0.5;
    }

    @keyframes show-inner {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0.5;
      }
    }
  }
}

.cn-color-scales-selected-icon {
  font-size: 14px;
  color: #ffd54f !important;
  margin-right: 4px;
}

</style>
