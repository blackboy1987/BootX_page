/**
 * 列表展示的字段
 */
import { CommonTableListItem } from '@/utils/interface/common';

export interface TableListItem extends CommonTableListItem {
  id?: number;
  name?: string;
  order?: number;
  createdDate?: Date;
  children?: DepartmentItem[];
}

export interface DepartmentTree {
  id: number;
  name: string;
  children: DepartmentTree[];
}

export interface TableListParams {
  id: number;
}
