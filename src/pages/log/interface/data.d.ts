/**
 * 列表展示的字段
 */
import {
  CommonTableListData,
  CommonTableListItem,
  CommonTableListPagination,
  CommonTableListParams,
} from '@/utils/interface/common';

export interface TableListItem extends CommonTableListItem {
  clientInfo: {
    [key: string]: string;
  };
}

/**
 * 分页数据
 */
export interface TableListPagination extends CommonTableListPagination {}

export interface TableListData extends CommonTableListData {}

/**
 * 搜索的数据
 */
export interface TableListParams extends CommonTableListParams {}
