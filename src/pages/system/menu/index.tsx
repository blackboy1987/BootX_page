import { Button, Card, Col, Row, message, Tag, Modal, Divider } from 'antd';
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component, Fragment, ReactText } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';

import CreateForm from '@/pages/system/menu/components/CreateForm';

import { handleStandardTableChange, TreeNodeItem } from '@/utils/common';
import TreeNode from '@/pages/components/TreeNode';
import { TableListPagination } from '@/pages/system/post/data';
import { SorterResult } from 'antd/lib/table/interface';
import styles from './style.less';
import { TableListItem } from './data.d';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { StateType } from './model';

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  menu: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  menuTree: TreeNodeItem[];
  tableTitle: string;
  parentId: number | '';
  addModalVisible: boolean;
  updateModalVisible: boolean;
  record: TableListItem;
}

class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    selectedRows: [],
    menuTree: [],
    tableTitle: '',
    parentId: '',
    addModalVisible: false,
    updateModalVisible: false,
    record: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '菜单名',
      dataIndex: 'name',
    },
    {
      title: '路由',
      dataIndex: 'url',
      width: 110,
    },
    {
      title: '序号',
      dataIndex: 'order',
      width: 50,
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
    this.tree();
  }

  list = (params: {}) => {
    const { dispatch } = this.props;
    const { parentId } = this.state;
    dispatch({
      type: 'menu/list',
      payload: {
        ...params,
        parentId,
      },
    });
    this.setState({
      selectedRows: [],
    });
  };

  tree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/tree',
      callback: (response: TreeNodeItem[]) => {
        this.setState({
          menuTree: response,
        });
      },
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
          type: `menu/${type1}`,
          payload: {
            id: record.id,
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

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    this.list({
      ...handleStandardTableChange(pagination, filtersArg, sorter),
    });
  };

  onSelectTreeNode = (selectedKeys: ReactText[], e: { selected: boolean; selectedNodes: any }) => {
    const { selectedNodes } = e;
    this.list({
      parentId: selectedKeys.join(','),
    });

    if (selectedNodes[0]) {
      this.setState({
        tableTitle: selectedNodes[0].title,
        parentId: selectedNodes[0].key,
      });
    } else {
      this.setState({
        tableTitle: '',
        parentId: '',
      });
    }
  };

  handleModalVisible = (flag: boolean, refresh: boolean) => {
    this.setState({
      addModalVisible: !!flag,
    });
    if (refresh) {
      this.list({});
      this.tree();
    }
  };

  handleUpdateModalVisible = (record: TableListItem, flag: boolean, refresh: boolean) => {
    this.setState({
      record,
      updateModalVisible: !!flag,
    });
    if (refresh) {
      this.list({});
      this.tree();
    }
  };

  render() {
    const {
      menu: { data },
      loading,
    } = this.props;

    const {
      addModalVisible,
      record,
      selectedRows,
      updateModalVisible,
      menuTree,
      tableTitle,
    } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false} size="small">
                <TreeNode
                  title="菜单列表"
                  items={menuTree}
                  onSelect={(selectedKeys: ReactText[], e: any) =>
                    this.onSelectTreeNode(selectedKeys, e)
                  }
                />
              </Card>
            </Col>
            <Col span={18}>
              <Card
                bordered={false}
                size="small"
                title={tableTitle ? <h1>上级菜单：{tableTitle}</h1> : <h1>顶级菜单</h1>}
              >
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
          <CreateForm
            record={record}
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
    menu,
    loading,
  }: {
    menu: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    menu,
    loading:
      loading.effects['menu/list'] ||
      loading.effects['menu/disabled'] ||
      loading.effects['menu/enabled'] ||
      loading.effects['menu/reset'] ||
      loading.effects['menu/save'] ||
      loading.effects['menu/update'],
  }),
)(TableList);
