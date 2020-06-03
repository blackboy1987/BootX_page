import { Button, Card, Col, Row, message, Tag, Modal, Divider } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import React, { Component, Fragment, ReactText } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import AllocationPermission from '@/pages/system/role/allocatePermission';
import CreateForm from '@/pages/system/role/components/CreateForm';

import { FormInstance } from 'antd/lib/form';
import { handleStandardTableChange, parseFormValues, TreeNodeItem } from '@/utils/common';
import { TableListPagination } from '@/pages/system/role/data';
import { SorterResult } from 'antd/lib/table/interface';
import TreeNode from '@/pages/components/TreeNode';
import styles from './style.less';
import { TableListItem } from './data.d';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { StateType } from './model';

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  role: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  allocatePermissionModalVisible: boolean;
  allocatePermissionRecord: TableListItem;
  addModalVisible: boolean;
  updateModalVisible: boolean;
  departmentTree: TreeNodeItem[];
  record: TableListItem;
}

class TableList extends Component<TableListProps, TableListState> {
  searchForm = React.createRef<FormInstance>();

  state: TableListState = {
    selectedRows: [],
    allocatePermissionModalVisible: false,
    allocatePermissionRecord: {},
    addModalVisible: false,
    updateModalVisible: false,
    departmentTree: [],
    record: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      width: 60,
      render: (text) => (text ? <Tag color="#108ee9">启用</Tag> : <Tag color="#f50">禁用</Tag>),
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      sorter: true,
      width: 170,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      width: 100,
      render: (text, record: TableListItem) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(record, true, false)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.update(record, 'remove')}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.list({});
    this.departmentTree();
  }

  departmentTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/departmentTree',
      callback: (response: TreeNodeItem[]) => {
        this.setState({
          departmentTree: response,
        });
      },
    });
  };

  list = (params: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/list',
      payload: {
        ...params,
      },
    });
    this.setState({
      selectedRows: [],
    });
  };

  update = (record: TableListItem, type1: string, content1?: string) => {
    const root = this;
    const content2 = () => {
      if (type1 === 'remove') {
        return '您正在执行账号删除操作';
      }
      if (type1 === 'enabled') {
        return '您正在执行账号启用操作';
      }
      if (type1 === 'disabled') {
        return '您正在执行账号禁用操作';
      }
      return '';
    };
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: '警告',
      content: content1 || content2(),
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: `role/${type1}`,
          payload: {
            ids: record.id,
          },
          callback: (response: { type: string; content: string }) => {
            const { type, content } = response;
            if (type === 'success') {
              message.success(content);
              root.list({});
            } else {
              message.error(content);
            }
          },
        });
      },
    });
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * 给角色分配权限
   */
  allocatePermission = () => {
    const { selectedRows } = this.state;
    message.destroy();
    if (selectedRows.length === 0) {
      message.warn('请选择一条记录');
    }
    if (selectedRows.length > 1) {
      message.warn('只能选择一条记录');
    } else {
      this.setState({
        allocatePermissionModalVisible: true,
        allocatePermissionRecord: selectedRows[0],
      });
    }
  };

  onClose = () => {
    this.setState({
      allocatePermissionModalVisible: false,
      allocatePermissionRecord: {},
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

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    this.list({
      ...handleStandardTableChange(pagination, filtersArg, sorter),
      ...parseFormValues(this.searchForm.current?.getFieldValue || {}),
    });
  };

  onSelect = (selectedKeys: ReactText[]) => {
    this.list({
      departmentId: selectedKeys && selectedKeys.join(','),
    });
  };

  render() {
    const {
      role: { data },
      loading,
    } = this.props;

    const {
      selectedRows,
      allocatePermissionModalVisible,
      allocatePermissionRecord,
      addModalVisible,
      record,
      updateModalVisible,
      departmentTree,
    } = this.state;

    return (
      <PageHeaderWrapper title={false}>
        <Row>
          <Col span={6}>
            <Card bordered={false}>
              <TreeNode
                title="部门列表"
                items={departmentTree}
                onSelect={(selectedKeys: ReactText[]) => this.onSelect(selectedKeys)}
              />
            </Card>
          </Col>
          <Col span={18}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button
                    disabled={loading}
                    icon={<PlusOutlined />}
                    onClick={() => this.handleModalVisible(true, false)}
                    type="primary"
                  >
                    新增
                  </Button>
                  <Button
                    title={loading || selectedRows.length === 0 ? '至少选择一条记录' : ''}
                    disabled={loading || selectedRows.length === 0}
                    icon={<DeleteOutlined />}
                    type="danger"
                  >
                    删除
                  </Button>
                  <Button
                    title={loading || selectedRows.length === 0 ? '请选择一条记录' : ''}
                    disabled={loading || selectedRows.length === 0}
                    icon={<UserAddOutlined />}
                    onClick={this.allocatePermission}
                  >
                    权限分配
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
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </Col>
        </Row>
        {addModalVisible && (
          <CreateForm
            modalVisible={addModalVisible}
            onCancel={(modalVisible: boolean, refresh: boolean) =>
              this.handleModalVisible(modalVisible, refresh)
            }
          />
        )}
        {record && Object.keys(record).length > 0 && updateModalVisible && (
          <CreateForm
            record={record}
            modalVisible={updateModalVisible}
            onCancel={(modalVisible: boolean, refresh: boolean) =>
              this.handleUpdateModalVisible({}, modalVisible, refresh)
            }
          />
        )}
        {allocatePermissionModalVisible && Object.keys(allocatePermissionRecord).length > 0 ? (
          <AllocationPermission
            onClose={this.onClose}
            allocatePermissionModalVisible={allocatePermissionModalVisible}
            allocatePermissionRecord={allocatePermissionRecord}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    role,
    loading,
  }: {
    role: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    role,
    loading:
      loading.effects['role/list'] ||
      loading.effects['role/disabled'] ||
      loading.effects['role/enabled'] ||
      loading.effects['role/save'] ||
      loading.effects['role/update'],
  }),
)(TableList);
