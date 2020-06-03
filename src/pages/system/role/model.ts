import { Reducer, Effect } from 'umi';
import { parseListData } from '@/utils/common';
import {
  list,
  edit,
  save,
  remove,
  disabled,
  enabled,
  departmentTree,
  permission,
  updatePermission,
} from './service';

import { TableListData, TableListItem } from './data.d';

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
    remove: Effect;
    edit: Effect;
    disabled: Effect;
    enabled: Effect;
    departmentTree: Effect;
    permission: Effect;
    updatePermission: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
    editInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'role',

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
    *departmentTree({ payload, callback }, { call }) {
      const response = yield call(departmentTree, payload);
      if (callback) {
        callback(response);
      }
    },
    *permission({ payload, callback }, { call }) {
      const response = yield call(permission, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePermission({ payload, callback }, { call }) {
      const response = yield call(updatePermission, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    listInfo(state, action) {
      const { content, pagination } = parseListData(action.payload);
      return {
        ...state,
        data: {
          list: content,
          pagination,
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
