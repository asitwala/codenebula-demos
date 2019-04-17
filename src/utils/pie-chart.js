import Chart from 'chart.js';
import * as d3 from 'd3';
import { interpolateColors } from './colorCalculations';

export function createChart(chartId, scaleName, chartData, rangeInfo, formatData) {
  const ctx = document.getElementById(chartId);

  console.log('chart data', chartData);

  /* eslint-disable */
  let COLORS = [];

  const dataLength = chartData.data.length;
  // const testData = [40000, 15000, 20000, 60000, 15000, 20000, 25000, 30000, 18000, 28000, 30000, 15000];
  // const dataLength = testData.length;

  COLORS = interpolateColors(dataLength, d3['interpolate' + scaleName], rangeInfo);


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

  return myChart;
}

export function updateChart(chartObj, scaleName, chartData, rangeInfo, formatData) {
  let dataLength = chartData.data.length;

  const COLORS = interpolateColors(dataLength, d3['interpolate' + scaleName], rangeInfo);

  chartObj.data.labels = chartData.labels;
  chartObj.data.datasets[0].backgroundColor = COLORS;
  chartObj.data.datasets[0].hoverBackgroundColor = COLORS;
  chartObj.data.datasets[0].data = chartData.data;

  chartObj.update();
}

export default {
  createChart,
  updateChart
};
