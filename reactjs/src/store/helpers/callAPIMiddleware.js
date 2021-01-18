export default function callAPIMiddleware({ dispatch, getState }) {
  return next => async (action) => {
    const {
      types,
      callAPI,
      shouldCallAPI = () => true,
      // used to pass remaining props from dispatch action along
      // `payload` in our case
      ...props
    } = action;
    // if we don't have the `types` prop
    // we're not supposed to intercept it with this middleware... move it along
    if (!types) {
      next(action);
      return;
    }

    if (
      !Array.isArray(types)
      || types.length !== 3 || !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }
    // If we shouldn't call the API, bail
    if (!shouldCallAPI(getState())) {
      return;
    }
    // break out types in order by request, success and failure
    const [requestType, successType, failureType] = types;
    // dispatch the request action (`REQ_ITEM`)
    dispatch({
      ...props,
      type: requestType,
    });
    try {
      const resp = await callAPI();
      // success, dispatch `REQ_ITEM_SUCCESS`
      // The reducer, itemsSuccess, expects an array so at least an empty array is provided
      const data = resp || [];
      dispatch({
        ...props,
        type: successType,
        data,
      });

      // UNCOMMENT WHEN READY FOR USER
      // const resp = await callAPI();
      // // success, dispatch `REQ_ITEM_SUCCESS`
      // // console.log(resp.data);
      // // The reducer, itemsSuccess, expects an array so at least an empty array is provided
      // const data = (resp.data) ? resp.data : [];
      // dispatch({
      //   ...props,
      //   type: successType,
      //   data,
      // });
    } catch (err) {
      // there was an error, dispatch `REQ_ITEM_ERROR`
      dispatch({
        ...props,
        type: failureType,
        err,
      });
    }
  };
}
