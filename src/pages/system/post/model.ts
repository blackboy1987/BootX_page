import { Effect, Reducer } from 'umi';

import { TableListData } from '@/pages/system/post/data';
import { list, save, tree, edit, remove, departmentTree } from './service';

import { TableListItem } from './data.d';

export interface StateType {
  data?: TableListData;
  value?: TableListItem;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    save: Effect;
    tree: Effect;
    edit: Effect;
    remove: Effect;
    departmentTree: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'post',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
    *tree({ payload, callback }, { call }) {
      const response = yield call(tree, payload);
      if (callback) {
        callback(response);
      }
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
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
    *departmentTree({ payload, callback }, { call }) {
      const response = yield call(departmentTree, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    listInfo(state, action) {
      const {
        data: { content = [], total = 0, pageNumber = 1, pageSize = 0 },
      } = action.payload;
      return {
        ...state,
        data: {
          list: content,
          pagination: {
            current: pageNumber,
            pageSize,
            total,
          },
        },
      };
    },
  },
};

export default Model;
