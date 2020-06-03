import { Button, Card, Tag, Divider, Modal, message } from 'antd';
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component, Fragment } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { ColumnProps } from 'antd/es/table';
import CreateForm from '@/pages/system/department/components/CreateForm';
import UpdateForm from '@/pages/system/department/components/UpdateForm';
import { StateType } from './model';
import StandardTable from './components/StandardTable';

import { TableListItem } from './data.d';

import styles from './style.less';

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  department: StateType;
}

interface TableListState {
  addModalVisible: boolean;
  updateModalVisible: boolean;
  record: TableListItem;
}

class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    addModalVisible: false,
    updateModalVisible: false,
    record: {},
  };

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 40,
    },
    {
      title: '排序',
      width: 50,
      dataIndex: 'order',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      width: 60,
      render: (text) => (text ? <Tag color="#108ee9">启用</Tag> : <Tag color="#f50">禁用</Tag>),
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      sorter: true,
      width: 170,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      width: 150,
      render: (text, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(record, true, false)}>编辑</a>
          <Divider type="vertical" />
          {record.children && record.children.length > 0 ? null : (
            <>
              <Divider type="vertical" />
              <a onClick={() => this.remove(record.id || 0)}>删除</a>
            </>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.list({});
  }

  list = (params: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'department/list',
      payload: {
        ...params,
      },
    });
  };

  remove = (id: number) => {
    const { dispatch } = this.props;
    if (!id) {
      return;
    }
    Modal.confirm({
      title: '提醒',
      content: '您正在执行数据删除操作！！！',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        dispatch({
          type: 'department/remove',
          payload: {
            ids: id,
          },
          callback: (response: { type: string; content: string }) => {
            const { type, content } = response;
            if (type === 'success') {
              message.success(content);
              this.list({});
            } else {
              message.error(content);
            }
          },
        });
      },
    });
  };

  handleModalVisible = (flag: boolean, refresh: boolean) => {
    this.setState({
      addModalVisible: !!flag,
    });
    if (refresh) {
      this.list({});
    }
  };

  handleUpdateModalVisible = (record: TableListItem, flag: boolean, refresh: boolean) => {
    this.setState({
      record,
      updateModalVisible: !!flag,
    });
    if (refresh) {
      this.list({});
    }
  };

  render() {
    const {
      department: { data },
      loading,
    } = this.props;
    const { addModalVisible, record, updateModalVisible } = this.state;

    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                disabled={loading}
                icon={<PlusOutlined />}
                onClick={() => this.handleModalVisible(true, false)}
                type="primary"
              >
                新建
              </Button>
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
            />
          </div>
        </Card>
        {addModalVisible && (
          <CreateForm
            modalVisible={addModalVisible}
            onCancel={(modalVisible: boolean, refresh: boolean) =>
              this.handleModalVisible(modalVisible, refresh)
            }
          />
        )}
        {record && Object.keys(record).length > 0 && updateModalVisible && (
          <UpdateForm
            values={record}
            modalVisible={updateModalVisible}
            onCancel={(modalVisible: boolean, refresh: boolean) =>
              this.handleUpdateModalVisible({}, modalVisible, refresh)
            }
          />
        )}
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    department,
    loading,
  }: {
    department: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    department,
    loading: loading.effects['department/list'],
  }),
)(TableList);
