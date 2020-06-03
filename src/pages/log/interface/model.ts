import { Reducer, Effect } from 'umi';
import { parseListData } from '@/utils/common';
import { list } from './service';

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
  };
  reducers: {
    listInfo: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'log',

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
  },

  reducers: {
    listInfo(state, action) {
      const { content, pagination } = parseListData(action.payload);
      console.log(content, pagination);
      return {
        ...state,
        data: {
          list: content,
          pagination,
        },
      };
    },
  },
};

export default Model;
