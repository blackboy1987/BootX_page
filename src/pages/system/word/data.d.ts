/**
 * 列表展示的字段
 */
import {
  CommonTableListData,
  CommonTableListPagination,
  CommonTableListParams,
} from '@/utils/interface/common';

export interface TableListItem {
  id?: number;
  name?: string;
  memo?: string;
  isEnabled?: boolean;
  isDefault?: boolean;
  departmentName?: string;
  createdDate?: Date;
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
