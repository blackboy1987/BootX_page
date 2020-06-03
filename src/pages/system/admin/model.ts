import { Effect, Reducer } from 'umi';
import {
  list,
  edit,
  save,
  remove,
  roleList,
  disabled,
  enabled,
  reset,
  permission,
  checkExport,
  importSave,
  departmentTree,
  add,
  postList,
} from './service';

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
    roleList: Effect;
    postList: Effect;
    disabled: Effect;
    enabled: Effect;
    reset: Effect;
    permission: Effect;
    checkExport: Effect;
    importSave: Effect;
    departmentTree: Effect;
    add: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
    editInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'admin',

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
    *roleList({ payload, callback }, { call }) {
      const response = yield call(roleList, payload);
      if (callback) {
        callback(response);
      }
    },
    *postList({ payload, callback }, { call }) {
      const response = yield call(postList, payload);
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
    *reset({ payload, callback }, { call }) {
      const response = yield call(reset, payload);
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
    *checkExport({ payload, callback }, { call }) {
      const response = yield call(checkExport, payload);
      if (callback) {
        callback(response);
      }
    },
    *importSave({ payload, callback }, { call }) {
      const response = yield call(importSave, payload);
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
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
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
