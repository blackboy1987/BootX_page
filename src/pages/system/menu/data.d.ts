/**
 * 列表展示的字段
 */
import {
  CommonTableListData,
  CommonTableListItem,
  CommonTableListPagination,
  CommonTableListParams,
} from '@/utils/interface/common.js';

export interface TableListItem extends CommonTableListItem {
  isEnabled?: boolean;
  name?: string;
  parentId?: number;
  parentName?: string;
  order?: number;
}

/**
 * 分页数据
 */
export interface TableListPagination extends CommonTableListPagination {}

export interface TableListData extends CommonTableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

/**
 * 搜索的数据
 */
export interface TableListParams extends CommonTableListParams {}
