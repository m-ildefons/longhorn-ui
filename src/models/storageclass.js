import { listStorageClasses, getStorageClass, createStorageClass, deleteStorageClass } from '../services/storageclass'
import { wsChanges, updateState } from '../utils/websocket'
import { enableQueryData } from '../utils/dataDependency'
import queryString from 'query-string'

export default {
  namespace: 'storageClass',
  state: {
    ws: null,
    data: [],
    selected: {},
    resourceType: 'storageClass',
    socketStatus: 'closed',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (enableQueryData(location.pathname, 'storageClass')) {
          dispatch({
            type: 'query',
            payload: location.pathname.startsWith('/storageClass') ? queryString.parse(location.search) : {},
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(listStorageClasses, payload)
      yield put({ type: 'listStorageClasses', payload: { ...data } })
    },
    *get({ payload }, { call, get }) {
      const data = yield call(getStorageClass, payload)
      yield get({ type: 'getStorageClass', payload: { ...data } })
    },
    *create({ payload, callback }, { call, put }) {
      yield call(createStorageClass, payload)
      if (callback) callback()
      yield put({ type: 'query' })
    },
    *delete({ payload, callback }, { call, put }) {
      yield call(deleteStorageClass, payload)
      if (callback) callback()
      yield put({ type: 'query' })
    },
    *bulkDelete({ payload, callback }, { call, put }) {
      if (payload && payload.length > 0) {
        yield payload.map(item => call(deleteStorageClass, item))
      }
      if (callback) callback()
      yield put({ type: 'query' })
    },
    *startWS({ payload }, { select }) {
      let ws = yield select(state => state.objectEndpoint.ws)
      if (ws) {
        ws.open()
      } else {
        wsChanges(payload.dispatch, payload.type, '1s', payload.ns)
      }
    },
    // eslint-disable-next-line no-unused-vars
    *stopWS({ payload }, { select }) {
      let ws = yield select(state => state.objectEndpoint.ws)
      if (ws) {
        ws.close(1000)
      }
    },
  },
  reducers: {
    listStorageClasses(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateBackground(state, action) {
      return updateState(state, action)
    },
    updateSocketStatus(state, action) {
      return { ...state, socketStatus: action.payload }
    },
    updateWs(state, action) {
      return { ...state, ws: action.payload }
    },
  },
}
