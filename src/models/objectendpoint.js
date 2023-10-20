import { listObjectEndpoints, getObjectEndpoint, createObjectEndpoint, deleteObjectEndpoint } from '../services/objectendpoint'

export default {
  namespace: 'objectstorage',
  state: {
    data: [],
    selected: {},
    resourceType: 'objectEndpoint',
    socketStatus: 'closed',
  },
  subscriptions: {},
  effects: {
    *list({
      payload,
    }, { call, get }) {
      const data = yield call(listObjectEndpoints, payload)
      yield get({ type: 'listObjectEndpoints', payload: { ...data } })
    },
    *get({
      payload,
    }, { call, get }) {
      const data = yield call(getObjectEndpoint, payload)
      yield get({ type: 'getObjectEndpoint', payload: { ...data } })
    },
    *create({
      payload,
    }, { call }) {
      yield call(createObjectEndpoint, payload)
    },
    *delete({
      payload,
    }, { call }) {
      yield call(deleteObjectEndpoint, payload)
    },
  },
  reducers: {
    listObjectEndpoints(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
}