import { Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, { Component } from 'react';

import { DepartmentItem } from '../../data.d';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnProps<DepartmentItem>[];
  data: DepartmentItem[];
}

const StandardTable: React.FC<Component<StandardTableProps<DepartmentItem>>> = ({
  data = [],
  rowKey,
  ...rest
}) => (
  <div className={styles.standardTable}>
    <Table rowKey={rowKey || 'id'} dataSource={data} {...rest} />
  </div>
);

export default StandardTable;
