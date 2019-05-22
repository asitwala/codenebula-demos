const mutations = {
  setScale(state, scaleName) {
    // eslint-disable-next-line
    state.scale = scaleName;
  },
  setStart(state, start) {
    // eslint-disable-next-line
    state.start = start;
  },
  setEnd(state, end) {
    // eslint-disable-next-line
    state.end = end;
  },
  setUseEndAsStart(state, useEndAsStart) {
    // eslint-disable-next-line
    state.useEndAsStart = useEndAsStart;
  },
};

export default mutations;
