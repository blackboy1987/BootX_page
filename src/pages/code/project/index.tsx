import { Button, Card, Col, Form, Input, Row, message, Modal, Select, DatePicker, Tag } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import React, { Component, Fragment } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import { parseFormValues } from '@/utils/common';
import { history } from '@@/core/history';
import MyAuthorized from '@/pages/MyAuthorized';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';

import { TableListItem } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  project: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
}

class TableList extends Component<TableListProps, TableListState> {
  searchForm = React.createRef<FormInstance>();

  state: TableListState = {
    selectedRows: [],
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '项目名',
      dataIndex: 'name',
    },
    {
      title: '项目描述',
      dataIndex: 'memo',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => {
        if (text === 0) {
          return <Tag>未开始</Tag>;
        }
        if (text === 1) {
          return <Tag>进行中</Tag>;
        }
        if (text === 2) {
          return <Tag>已结束</Tag>;
        }
        if (text === 3) {
          return <Tag>已挂起</Tag>;
        }
        return <Tag>{text}</Tag>;
      },
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
          <MyAuthorized
            authorizedType="a"
            authority={['/code/project/edit', '/code/project/update']}
            onClick={() => history.push(`/code/project/edit/${record.id}`)}
            title="编辑"
            divider
          />
          <MyAuthorized
            authorizedType="a"
            authority={['/code/project/delete']}
            onClick={() => this.update(record, 'remove')}
            title="删除"
          />
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
      type: 'project/list',
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
    let ids: number[] = [];
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
          type: `project/${type1}`,
          payload: {
            ids,
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

  handleSearch = (values: { [key: string]: any }) => {
    this.list({
      ...parseFormValues(values),
    });
  };

  renderSimpleForm = () => {
    return (
      <Form ref={this.searchForm} onFinish={this.handleSearch}>
        <Row gutter={16}>
          <Col md={5}>
            <FormItem label="名称" name="name">
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col md={5}>
            <FormItem label="描述" name="memo">
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col md={4}>
            <FormItem label="状态" name="isEnabled">
              <Select>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="0">未开始</Select.Option>
                <Select.Option value="1">进行中</Select.Option>
                <Select.Option value="2">已结束</Select.Option>
                <Select.Option value="3">已挂起</Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col md={8}>
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

  render() {
    const {
      project: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                disabled={loading}
                icon={<PlusOutlined />}
                onClick={() => history.push('/code/project/add')}
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
                type="primary"
                authority={['/code/project/delete']}
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
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
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
    project,
    loading,
  }: {
    project: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    project,
    loading:
      loading.effects['project/list'] ||
      loading.effects['project/save'] ||
      loading.effects['project/update'],
  }),
)(TableList);
