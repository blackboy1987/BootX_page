/**
 * 列表展示的字段
 */
export interface CommonTableListItem {
  id?: number;
  createdDate?: Date;
}

/**
 * 分页数据
 */
export interface CommonTableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface CommonTableListData {
  list: CommonTableListItem[];
  pagination: Partial<CommonTableListPagination>;
}

/**
 * 搜索的数据
 */
export interface CommonTableListParams {
  id: number;
  pageNumber: number;
  pageSize: number;
  orderProperty: string | undefined;
  orderDirection: string;
}
