import { Button, Card, Col, Form, Input, Row, message, Tag, Modal, Select, DatePicker } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import React, { Component, Fragment, ReactText } from 'react';
import { SorterResult } from 'antd/lib/table/interface';
import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import {
  handleStandardTableChange,
  parseFormValues,
  TreeNodeItem,
  YPMessage,
  YPResult,
} from '@/utils/common';
import MyAuthorized from '@/pages/MyAuthorized';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import CreateForm from '@/pages/system/post/components/CreateForm';

import { TableListItem, TableListPagination } from './data.d';

import styles from './style.less';
import TreeNode from '@/pages/components/TreeNode';

const FormItem = Form.Item;

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  post: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  addModalVisible: boolean;
  updateModalVisible: boolean;
  departmentTree: TreeNodeItem[];
  record: TableListItem;
}

class TableList extends Component<TableListProps, TableListState> {
  searchForm = React.createRef<FormInstance>();

  state: TableListState = {
    selectedRows: [],
    addModalVisible: false,
    updateModalVisible: false,
    departmentTree: [],
    record: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '部门',
      dataIndex: 'departmentName',
      width: 100,
    },
    {
      title: '岗位名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '岗位类型',
      dataIndex: 'level',
      render: (text) => {
        if (text === 1) {
          return '高层';
        }
        if (text === 2) {
          return '中层';
        }
        if (text === 3) {
          return '基层';
        }
        if (text === 4) {
          return '其他';
        }
        return text;
      },
    },
    {
      title: '排序',
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
      width: 150,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      width: 100,
      render: (text, record: TableListItem) => (
        <Fragment>
          <MyAuthorized
            authorizedType="a"
            authority={['/system/post/edit', '/system/post/update']}
            onClick={() => this.handleUpdateModalVisible(record, true, false)}
            title="编辑"
            divider
          />
          <MyAuthorized
            authorizedType="a"
            authority={['/system/post/delete']}
            onClick={() => this.update(record, 'remove')}
            title="删除"
          />
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
      type: 'post/departmentTree',
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
      type: 'post/list',
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
    let ids: (number | undefined)[] = [];
    if (!record.id) {
      const { selectedRows } = this.state;
      ids = [...selectedRows.map((item) => item.id)];
    } else {
      ids = [record.id];
    }
    if (ids.length === 0) {
      message.destroy();
      message.warn('请选择要操作的数据');
      return;
    }

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
          type: `post/${type1}`,
          payload: {
            ids,
          },
          callback: (response: YPResult) => {
            YPMessage(response, () => {
              root.list({});
            });
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

  handleSearch = (values: { [key: string]: any }) => {
    this.list({
      ...parseFormValues(values),
    });
  };

  renderSimpleForm = () => {
    return (
      <Form ref={this.searchForm} onFinish={this.handleSearch}>
        <Row gutter={16}>
          <Col md={9}>
            <FormItem label="岗位名称" name="name">
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="状态" name="isEnabled">
              <Select>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">禁用</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={9}>
            <FormItem label="添加时间" name="rangeDate">
              <DatePicker.RangePicker separator="~" />
            </FormItem>
          </Col>
          <Col md={2}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
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
      post: { data },
      loading,
    } = this.props;

    const {
      addModalVisible,
      record,
      selectedRows,
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
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
                  <MyAuthorized
                    authorizedType="button"
                    type="danger"
                    authority={['/system/post/delete']}
                    title="删除"
                    disabled={selectedRows.length === 0}
                    icon={<DeleteOutlined />}
                    onClick={() => this.update({}, 'remove')}
                  />
                </div>
                <StandardTable
                  bordered
                  size="small"
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data || { list: [], pagination: false }}
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
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    post,
    loading,
  }: {
    post: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    post,
    loading:
      loading.effects['post/list'] ||
      loading.effects['post/disabled'] ||
      loading.effects['post/enabled'] ||
      loading.effects['post/save'] ||
      loading.effects['post/update'],
  }),
)(TableList);
