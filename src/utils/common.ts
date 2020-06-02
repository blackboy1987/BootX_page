import moment, { Moment } from 'moment';
import { message } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import {
  CommonTableListItem,
  CommonTableListPagination,
  CommonTableListParams,
} from '@/utils/interface/common';

export interface TreeNodeItem {
  id: number;
  name: string;
  children?: TreeNodeItem[];
}

export interface YPResult {
  code: number;
  msg: string;
  data?: {
    [key: string]: any;
  };
}

interface ListPagination {
  content: any[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

export const YPMessage = (response: YPResult, callback?: Function): void => {
  message.destroy();
  const { code, msg } = response;
  if (code === 0) {
    message.success(msg);
  } else {
    message.error(msg);
  }
  if (callback) {
    callback();
  }
};

export const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map((key1) => obj[key1])
    .join(',');

/**
 * 格式化表单域的值（主要处理时间）
 * @param values
 */
export const parseFormValues = (values: { [key: string]: any }): {} => {
  const { beginDate, endDate } = parseRangeDate(values.rangeDate);
  const { beginDate: beginDate1, endDate: endDate1 } = parseRangeDate(values.rangeDate1);

  // eslint-disable-next-line no-param-reassign
  delete values?.rangeDate;
  // eslint-disable-next-line no-param-reassign
  delete values?.rangeDate1;
  return {
    ...values,
    beginDate,
    endDate,
    beginDate1,
    endDate1,
  };
};

/**
 * 格式化时间区间
 * @param rangeDate
 */
export function parseRangeDate(rangeDate: Moment[]) {
  const values: {
    beginDate?: string;
    endDate?: string;
  } = {};
  if (rangeDate) {
    if (rangeDate[0]) {
      values.beginDate = moment(rangeDate[0]).format('YYYY-MM-DD 00:00:00');
    }
    if (rangeDate[1]) {
      values.endDate = moment(rangeDate[1]).format('YYYY-MM-DD 23:59:59');
    }
  }
  return values;
}

/**
 * 搜索栏的参数格式化（主要是时间区间）
 * @param params
 */
export const handleSearch = (params: { [key: string]: any }): {} => {
  return parseFormValues(params);
};

/**
 * 列表页面的分页跳转
 * @param pagination
 * @param filtersArg
 * @param sorter
 */
export const handleStandardTableChange = (
  pagination: Partial<CommonTableListPagination>,
  filtersArg: Record<keyof CommonTableListItem, string[]>,
  sorter: SorterResult<CommonTableListItem>,
) => {
  const filters = Object.keys(filtersArg).reduce((obj, key1) => {
    const newObj = { ...obj };
    newObj[key1] = getValue(filtersArg[key1]);
    return newObj;
  }, {});

  const params: Partial<CommonTableListParams> = {
    pageNumber: pagination.current,
    pageSize: pagination.pageSize,
    ...filters,
  };
  if (sorter.field) {
    // @ts-ignore
    params.orderProperty = sorter.field;
    params.orderDirection = sorter.order === 'ascend' ? 'asc' : 'desc';
  }

  return params;
};

export const parseListData = (listResponse: {
  code: number;
  data: { content: any[]; pageNumber: number; pageSize: number; total: number };
  msg: string;
  type: string;
}): ListPagination => {
  const {
    data: { content = [], pageNumber = 0, pageSize = 20, total = 0 },
  } = listResponse;

  return {
    content,
    pagination: {
      current: pageNumber,
      pageSize,
      total,
    },
  };
};
