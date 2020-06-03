import { Button, Card, Col, Form, Input, Row, message, Tag, Modal, Select, DatePicker } from 'antd';
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
import { getSiteInfo, parseFormValues } from '@/utils/common';
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
  entity: StateType;
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
      title: '项目',
      dataIndex: 'projectName',
      width: 100,
    },
    {
      title: '模块中文名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '模块英文名',
      dataIndex: 'alias',
    },
    {
      title: '描述',
      dataIndex: 'memo',
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
      width: 220,
      render: (text, record: TableListItem) => (
        <Fragment>
          <MyAuthorized
            authorizedType="a"
            authority={['/code/entity/edit', '/code/entity/update']}
            onClick={() => history.push(`/code/entity/edit/${record.id}`)}
            title="编辑"
            divider
          />

          <MyAuthorized
            authorizedType="a"
            authority={['/code/entity/delete']}
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
      type: 'entity/list',
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
      if (type1 === 'enabled') {
        return '您正在执行账号启用操作';
      }
      if (type1 === 'reset') {
        return `您正在执行账户重置密码操作，密码将重置为${getSiteInfo('defaultPassword')}！！！`;
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
          type: `entity/${type1}`,
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
            <FormItem label="姓名" name="name">
              <Input placeholder="请输入" />
            </FormItem>
          </Col>
          <Col md={5}>
            <FormItem label="手机号" name="mobile">
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
      entity: { data },
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
                onClick={() => history.push('/code/entity/add')}
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
                authority={['/code/entity/delete']}
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
    entity,
    loading,
  }: {
    entity: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    entity,
    loading:
      loading.effects['entity/list'] ||
      loading.effects['entity/disabled'] ||
      loading.effects['entity/enabled'] ||
      loading.effects['entity/save'] ||
      loading.effects['entity/update'],
  }),
)(TableList);
