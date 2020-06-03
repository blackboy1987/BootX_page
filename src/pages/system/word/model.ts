import { Effect, Reducer } from 'umi';
import { list, edit, save, remove, disabled, enabled, wordTypeAll } from './service';

import { TableListData, TableListItem } from './data.d';

export interface StateType {
  data?: TableListData;
  values?: TableListItem;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    save: Effect;
    remove: Effect;
    edit: Effect;
    disabled: Effect;
    enabled: Effect;
    wordTypeAll: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
    editInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'word',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    values: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'listInfo',
        payload: response,
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(save, payload);
      if (callback) {
        callback(response);
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) {
        callback(response);
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      yield put({
        type: 'editInfo',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *enabled({ payload, callback }, { call }) {
      const response = yield call(enabled, payload);
      if (callback) {
        callback(response);
      }
    },
    *disabled({ payload, callback }, { call }) {
      const response = yield call(disabled, payload);
      if (callback) {
        callback(response);
      }
    },
    *wordTypeAll({ payload, callback }, { call }) {
      const response = yield call(wordTypeAll, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    listInfo(state, action) {
      const { data = [], total = 0, current = 1, pageSize = 0 } = action.payload;
      return {
        ...state,
        data: {
          list: data,
          pagination: {
            current,
            pageSize,
            total,
          },
        },
      };
    },
    editInfo(state, action) {
      return {
        ...state,
        values: action.payload,
      };
    },
  },
};

export default Model;
