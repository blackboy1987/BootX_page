import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/lib/table';
import React, { Component, Fragment } from 'react';

import styles from './index.less';
import { CommonTableListItem } from '@/utils/interface/common';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: CommonTableListItem[];
    pagination: StandardTableProps<CommonTableListItem>['pagination'];
  };
  selectedRows: CommonTableListItem[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<CommonTableListItem> {}

interface StandardTableState {
  selectedRowKeys: string[];
}

class StandardTable extends Component<StandardTableProps<CommonTableListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<CommonTableListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<CommonTableListItem>) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange: TableRowSelection<CommonTableListItem>['onChange'] = (
    selectedRowKeys: any[],
    selectedRows: CommonTableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange: TableProps<CommonTableListItem>['onChange'] = (
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

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
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

    const rowSelection: TableRowSelection<CommonTableListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                共 <a style={{ fontWeight: 600 }}>{total}</a> 项&nbsp;&nbsp; 已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
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
