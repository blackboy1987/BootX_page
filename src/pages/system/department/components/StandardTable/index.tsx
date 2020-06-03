import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, { Component } from 'react';

import styles from './index.less';
import { TableListItem } from '@/pages/system/department/data';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnProps<TableListItem>[];
  data: TableListItem[];
}

const StandardTable: React.FC<Component<StandardTableProps<TableListItem>>> = ({
  data = [],
  rowKey,
  ...rest
}) => (
  <div className={styles.standardTable}>
    <Table rowKey={rowKey || 'id'} dataSource={data} {...rest} />
  </div>
);

export default StandardTable;
