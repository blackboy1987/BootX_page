import { AnyAction, Reducer } from 'umi';
import { EffectsCommandMap } from 'dva';
import { list, save, tree, edit, remove } from './service';

import { DepartmentItem } from './data.d';

export interface StateType {
  data: DepartmentItem[];
  value?: DepartmentItem;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    list: Effect;
    save: Effect;
    tree: Effect;
    edit: Effect;
    remove: Effect;
  };
  reducers: {
    listInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'department',

  state: {
    data: [],
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
  },

  reducers: {
    listInfo(state, action) {
      return {
        ...state,
        data: action.payload || [],
      };
    },
  },
};

export default Model;
