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
  isEnabled?: boolean;
  isChecked?: boolean;
  type?: number;
  name?: string;
  memo?: string;
  urls?: string[];
  menuName?: string;
}

/**
 * 表单展示的数据
 */
export interface MenuTree {
  id: number;
  name: string;
  children: MenuTree[];
}

/**
 * 分页数据
 */
export interface TableListPagination extends CommonTableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData extends CommonTableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

/**
 * 搜索的数据
 */
export interface TableListParams extends CommonTableListParams {
  id: null;
  sorter: string;
  status: string;
  name: string;
  current: number;
  type: number;
  currentPage: number;
  pageNumber: number;
  orderProperty: string;
  orderDirection: string;
}
