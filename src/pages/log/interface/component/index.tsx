import { Alert, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React, { Component, Fragment } from 'react';

import styles from './index.less';
import { TableListItem } from '@/pages/log/interface/data';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: TableListItem[];
    pagination: StandardTableProps<TableListItem>['pagination'];
  };
  selectedRows: TableListItem[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<TableListItem> {}

interface StandardTableState {
  selectedRowKeys: string[];
}

class StandardTable extends Component<StandardTableProps<TableListItem>, StandardTableState> {
  handleTableChange: TableProps<TableListItem>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    // @ts-ignore
    const { total = 0 } = pagination;
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                共 <a style={{ fontWeight: 600 }}>{total}</a> 项&nbsp;&nbsp; 已选择{' '}
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={rowKey || 'id'}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
