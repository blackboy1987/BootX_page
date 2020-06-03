import { Button, Card } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import React, { Component } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import { TableListItem, TableListPagination } from '@/pages/system/post/data';
import { SorterResult } from 'antd/lib/table/interface';
import { handleStandardTableChange } from '@/utils/common';
import StandardTable, { StandardTableColumnProps } from '@/pages/log/interface/component';
import styles from './style.less';
import { StateType } from './model';

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  log: StateType;
}

class TableList extends Component<TableListProps> {
  columns: StandardTableColumnProps[] = [
    {
      title: '操作',
      dataIndex: 'operation',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'action',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: 100,
    },
    {
      title: '操作系统',
      dataIndex: 'clientInfo.os',
      render: (text, record) => <span>{record.clientInfo.os}</span>,
      width: 100,
    },
    {
      title: '浏览器',
      dataIndex: 'clientInfo.browser',
      render: (text, record) => (
        <>
          <span>{record.clientInfo.browser}</span>(
          <span style={{ color: 'red', fontWeight: 500 }}>{record.clientInfo.browserVersion}</span>)
        </>
      ),
      width: 180,
    },
    {
      title: '调用时间',
      dataIndex: 'createdDate',
      sorter: true,
      width: 160,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  componentDidMount() {
    this.list({});
  }

  list = (params: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/list',
      payload: {
        ...params,
      },
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    this.list({
      ...handleStandardTableChange(pagination, filtersArg, sorter),
    });
  };

  render() {
    const {
      log: { data },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                disabled={loading}
                icon={<ReloadOutlined />}
                type="primary"
                onClick={() => this.list({})}
              >
                刷新
              </Button>
            </div>
            <StandardTable
              bordered
              size="small"
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    log,
    loading,
  }: {
    log: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    log,
    loading: loading.effects['log/list'],
  }),
)(TableList);
