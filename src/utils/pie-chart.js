import Chart from 'chart.js';
import { interpolateCool, interpolateWarm } from 'd3-scale-chromatic';
import { interpolateColors, mix2Scales } from './colorCalculations';

export function createChart(chartId, chartData, formatData) {
  const ctx = document.getElementById(chartId);

  /* eslint-disable */
  let COLORS = [];

  const dataLength = chartData.data.length;
  // const testData = [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000, 18000, 28000, 30000, 15000];
  // const dataLength = testData.length;

  const use2Scales = dataLength > 6;

  if (use2Scales) {
    let data1Info = {
      interpolateMethod: interpolateCool,
      rangeInfo: {
        start: 0, 
        end: 0.65,
        useEndAsStart: true,
      }
    };

    let data2Info = {
      interpolateMethod: interpolateWarm,
      rangeInfo: {
        start: 0, 
        end: 0.65,
        useEndAsStart: true,
      }
    };
    COLORS = mix2Scales(dataLength, data1Info, data2Info);

  } else {
    let rangeInfo = {
      start: 0, 
      end: 0.65,
      useEndAsStart: true,
    };
    COLORS = interpolateColors(dataLength, interpolateWarm, rangeInfo);
  }

  /* eslint-disable */
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartData.labels, // ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test 8', 'Test 9', 'Test 10', 'Test 11', 'Test 12']
      datasets: [
        {
          backgroundColor: COLORS,
          hoverBackgroundColor: COLORS,
          data: chartData.data, // [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000, 18000, 28000, 30000, 15000]
          fontFamily: 'Open Sans',
        },
      ],
    },
    width: '200',
    height: '200',
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      hover: {
        onHover: function(e) {
          var point = this.getElementAtEvent(e);
          e.target.style.cursor = point.length ? 'pointer' : 'default';
        },
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const { index } = tooltipItem;
            const { labels, datasets } = data;
            const dataArray = datasets[0].data;
            return `${labels[index]}: ${formatData(
              dataArray[index]
            )}`;
          }
        },
      },
    },
  });
}
export default {
  createChart,
};
