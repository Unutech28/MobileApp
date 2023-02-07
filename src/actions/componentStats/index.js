export const manageComponentStats = (
  componentId,
  screenName,
  componentStats,
) => {
  return dispatch => {
    let data = { ...componentStats, [screenName]: componentId };
    dispatch({ type: 'componentStats', payload: data });
  };
};
export const setCurrentComponent = (componentInfo) => {
  return dispatch => {
    dispatch({ type: 'componentStats', payload: componentInfo });
  };
};

