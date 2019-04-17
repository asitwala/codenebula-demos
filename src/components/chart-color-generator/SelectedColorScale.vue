<template>
  <div class="cn-selected-scale-options">
    <div class="cn-selected-scale-configuration">
      <v-text-field
        v-model="start"
        class="cn-scale-range"
        hide-details
        single-line
        type="number"
      ></v-text-field>

      <v-text-field
        v-model="end"
        class="cn-scale-range"
        hide-details
        single-line
        type="number"
      ></v-text-field>
    </div>

    <v-range-slider
      v-model="range"
    ></v-range-slider>

    <div class="cn-selected-scale">
    </div>

    <div class="cn-selected-scale-divider">
      <v-icon>fas fa-arrow-circle-down</v-icon>
    </div>

    <div class="cn-selected-scale-with-range">
    </div>
  </div>
</template>


<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      width: 400,
      height: 24,
      range: [0, 100],
    };
  },
  mounted() {
    this.createScale(this.scaleName, '.cn-selected-scale', false, 0, 1);
    this.createScale(this.scaleName, '.cn-selected-scale-with-range', false, this.start, this.end);
  },
  methods: {
    createScale(scaleName, selector, useEndAsStart, start, end) {
      const { width, height } = this;
      console.log('end', end);
      const svg = d3.select(selector)
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
        .style('fill', function (d) { return d3['interpolate' + scaleName](0 + (d * (1 / width))); });
    },
    updateScale(scaleName, selector, useEndAsStart, start, end) {
      const { width } = this;
      d3.select(selector).selectAll('.bars')
        .transition()
        // eslint-disable-next-line
        .style('fill', function (d) { return d3['interpolate' + scaleName](start + (d * ((end - start) / width))); });
    },
  },
  computed: {
    scaleName() {
      return this.$store.getters.scale;
    },
    start: {
      get() {
        return this.$store.getters.start;
      }, 
      set(start) {
        const parsedStart = parseFloat(start);
        this.range[0] = parsedStart * 100;
        this.$store.commit('setStart', parsedStart);
      },
    },
    end: {
      get() {
        return this.$store.getters.end;
      },
      set(end) {
        const parsedEnd = parseFloat(end);
        this.range[1] = parsedEnd * 100;
        this.$store.commit('setEnd', parsedEnd);
      }
    },
  },
  watch: {
    '$store.getters.scale': {
      // eslint-disable-next-line
      handler: function (scaleName) {
        this.updateScale(scaleName, '.cn-selected-scale svg', false, 0, 1);
        this.updateScale(scaleName, '.cn-selected-scale-with-range svg', false, this.start, this.end);
      },
    },
    range: {
      // eslint-disable-next-line
      handler: function (value) {
        const start = value[0] / 100;
        const end = value[1] / 100;
        this.$store.commit('setStart', start);
        this.$store.commit('setEnd', end);
        this.updateScale(this.scaleName, '.cn-selected-scale-with-range svg', false, start, end);
      },
      deep: true,
    },
  },
};

</script>

<style lang='scss'>
.cn-selected-scale-configuration {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cn-scale-range {
  display: inline-block;
  max-width: 100px;

  &:nth-of-type(1) {
    margin-right: 40px;
  }
}

.cn-selected-scale-divider {
  display: flex;
  justify-content: center;
  margin: 12px 0;
  i {
    color: #91a3ff !important;
  }
}

</style>
