/* eslint-disable */
function calculatePoint(rangeInfo, i, scaleInterval) {
  let { start, end, useEndAsStart } = rangeInfo;
  return (useEndAsStart ? (end - (i * scaleInterval)) : (start + (i * scaleInterval)));
}


/* Returns an array of color codes the length of 'dataLength' */
export function interpolateColors(dataLength, interpolateMethod, rangeInfo) {
  let { start, end } = rangeInfo;
  const range = end - start;
  const scaleInterval = range / dataLength;
  let color, i;
  let colorArray = [];

  for (i = 0; i < dataLength; i++) {
    color = calculatePoint(rangeInfo, i, scaleInterval);
    colorArray.push(interpolateMethod(color));
  }

  return colorArray;
}


export function mix2Scales(dataLength, data1Obj, data2Obj) {
  let data1Length = Math.round(dataLength / 2);
  let data2Length = dataLength - data1Length;

  // Let data1 have a greater length
  if (data1Length <= data2Length) {
    let tempDataLength = data1Length;
    data1Length = data2Length;
    data2Length = tempDataLength;
  }

  let colors1 = interpolateColors(data1Length, data1Obj.interpolateMethod, data1Obj.rangeInfo);
  let colors2 = interpolateColors(data2Length, data2Obj.interpolateMethod, data2Obj.rangeInfo);

  return colors1.concat(colors2);
}



export default {
  interpolateColors,
  mix2Scales,
};
