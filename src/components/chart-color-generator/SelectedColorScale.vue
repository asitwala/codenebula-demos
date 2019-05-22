<template>
  <div class="cn-selected-scale-options">
    <v-checkbox
      hide-details
      single-line
      v-model="useEndAsStart"
      class="cn-selected-scale-useEnd"
      color="primary"
      label="Use end of scale as start" />
    <div class="cn-selected-scale-configuration">
      <!-- START INPUT -->
      <v-tooltip
        class="cn-scale-range-wrapper"
        top
        color="error"
        :value="startHasError"
        :disabled="!startHasError">
        <v-text-field
          slot="activator"
          v-model="start"
          single-line
          hide-details
          class="cn-scale-range"
          type="number"
          :error="startHasError"
          :error-count="startHasError? 1 : 0"
        ></v-text-field>
        <span>
          {{ error }}
        </span>
      </v-tooltip>

      <!-- END INPUT -->
      <v-tooltip
        class="cn-scale-range-wrapper"
        top
        color="error"
        :value="endHasError"
        :disabled="!endHasError">
        <v-text-field
          slot="activator"
          v-model="end"
          single-line
          hide-details
          class="cn-scale-range"
          type="number"
          :error="endHasError"
          :error-count="endHasError? 1 : 0"
        ></v-text-field>
        <span>
          {{ error }}
        </span>
      </v-tooltip>

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
      width: 300,
      height: 24,
      range: [0, 100],
      endHasError: false,
      startHasError: false,
      error: 'Value must be between 0 and 1',
    };
  },
  mounted() {
    this.createScale(this.scaleName, '.cn-selected-scale', false, 0, 1);
    this.createScale(this.scaleName, '.cn-selected-scale-with-range', this.useEndAsStart, this.start, this.end);
  },
  methods: {
    // eslint-disable-next-line
    createScale(scaleName, selector, useEndAsStart, start, end) {
      const { width, height } = this;
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
        .style('fill', function (d) { 
          return useEndAsStart
            ? d3[`interpolate${scaleName}`](end - (d * ((end - start) / width)))
            : d3[`interpolate${scaleName}`](start + (d * ((end - start) / width)));
        });
    },
    updateScale(scaleName, selector, useEndAsStart, start, end) {
      const { width } = this;
      d3.select(selector).selectAll('.bars')
        .transition()
        // eslint-disable-next-line
        .style('fill', function (d) {
          return useEndAsStart
            ? d3[`interpolate${scaleName}`](end - (d * ((end - start) / width)))
            : d3[`interpolate${scaleName}`](start + (d * ((end - start) / width)));
        });
    },
  },
  computed: {
    scaleName() {
      return this.$store.getters.scale;
    },
    useEndAsStart: {
      get() {
        return this.$store.getters.useEndAsStart;
      },
      set(useEnd) {
        this.$store.commit('setUseEndAsStart', useEnd);
      },
    },
    start: {
      get() {
        return this.$store.getters.start;
      },
      set(start) {
        if (this.startHasError) {
          this.startHasError = false;
        }

        const parsedStart = parseFloat(start);
        if (parsedStart >= 0 && parsedStart <= 1) {
          // Remove and insert to update DOM
          this.range.splice(0, 1);
          this.range.splice(0, 0, parsedStart * 100);
          this.$store.commit('setStart', parsedStart);
        } else {
          // Throw Error
          this.startHasError = true;
        }
      },
    },
    end: {
      get() {
        return this.$store.getters.end;
      },
      set(end) {
        /* Clear Error */
        if (this.endHasError) {
          this.endHasError = false;
        }

        const parsedEnd = parseFloat(end);
        if (parsedEnd >= 0 && parsedEnd <= 1) {
          // Remove and insert to update DOM
          this.range.splice(1, 1);
          this.range.splice(1, 0, parsedEnd * 100);
          this.$store.commit('setEnd', parsedEnd);
        } else {
          // Throw Error
          this.endHasError = true;
        }
      },
    },
  },
  watch: {
    '$store.getters.scale': {
      // eslint-disable-next-line
      handler: function (scaleName) {
        this.updateScale(scaleName, '.cn-selected-scale svg', false, 0, 1);
        this.updateScale(scaleName, '.cn-selected-scale-with-range svg', this.useEndAsStart, this.start, this.end);
      },
    },
    range: {
      // eslint-disable-next-line
      handler: function (value) {
        const start = value[0] / 100;
        const end = value[1] / 100;
        this.$store.commit('setStart', start);
        this.$store.commit('setEnd', end);
        this.updateScale(this.scaleName, '.cn-selected-scale-with-range svg', this.useEndAsStart, start, end);
      },
      deep: true,
    },
    '$store.getters.useEndAsStart': {
      // eslint-disable-next-line
      handler: function(value) {
        this.updateScale(this.scaleName, '.cn-selected-scale-with-range svg', value, this.start, this.end);
      },
    },
  },
};
</script>

<style lang='scss'>

.cn-selected-scale-useEnd {
  margin: 0px !important;
  margin-left: -4px !important;

  label {
    font-size: 14px !important;
  }
}

.cn-selected-scale-configuration {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cn-selected-scale-options {
  width: 300px;
  margin: 0 auto;
  .v-slider__thumb-container {
    cursor: pointer !important;
  }
}

.cn-scale-range {
  display: inline-block;
  max-width: 100px;
}

.cn-scale-range-wrapper {
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
