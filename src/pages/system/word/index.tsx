import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  Tag,
  Modal,
  Select,
  Divider,
  DatePicker,
} from 'antd';
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component, Fragment } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import { getSiteInfo, parseFormValues } from '@/utils/common';
import { history } from '@@/core/history';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';

import { TableListItem } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  word: StateType;
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
      title: '分类',
      dataIndex: 'wordTypeName',
    },
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
      title: '状态',
      dataIndex: 'isEnabled',
      width: 120,
      render: (text, record) => {
        return (
          <>
            {text ? <Tag color="#108ee9">启用</Tag> : <Tag color="#f50">禁用</Tag>}
            {record.isDefault ? <Tag color="#108ee9">默认</Tag> : null}
          </>
        );
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
          <a onClick={() => history.push(`/system/word/edit/${record.id}`)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.update(record, 'remove')}>删除</a>
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
      type: 'word/list',
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
          type: `word/${type1}`,
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
      word: { data },
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
                onClick={() => history.push('/system/word/add')}
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
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    word,
    loading,
  }: {
    word: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    word,
    loading:
      loading.effects['word/list'] ||
      loading.effects['word/disabled'] ||
      loading.effects['word/enabled'] ||
      loading.effects['word/save'] ||
      loading.effects['word/update'],
  }),
)(TableList);
