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

import { Dispatch } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import { getSiteInfo, parseFormValues } from '@/utils/common';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';

import { TableListItem } from './data.d';

import styles from './style.less';
import CreateForm from "@/pages/system/wordType/components/CreateForm";
import UpdateForm from "@/pages/system/wordType/components/UpdateForm";

const FormItem = Form.Item;

interface TableListProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  wordType: StateType;
}

interface TableListState {
  selectedRows: TableListItem[];
  addModalVisible:boolean;
  record:TableListItem;
}

class TableList extends Component<TableListProps, TableListState> {
  formRef = React.createRef<FormInstance>();

  state: TableListState = {
    selectedRows: [],
    addModalVisible: false,
    record:{}
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '分类名',
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
          <a onClick={() => this.handleUpdateModalVisible(record,true,false)}>编辑</a>
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
      type: 'wordType/list',
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
          type: `wordType/${type1}`,
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
      <Form ref={this.formRef} onFinish={this.handleSearch}>
        <Row gutter={16}>
          <Col md={8}>
            <FormItem label="分类名" name="name">
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
              <DatePicker.RangePicker separator="~" style={{width:'100%'}} />
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

  handleModalVisible=(flag:boolean,refresh:boolean)=>{
    this.setState({
      addModalVisible:!!flag,
    })
    if(refresh){
      this.list({});
    }
  }

  handleUpdateModalVisible=(record:TableListItem,flag:boolean,refresh:boolean)=>{
    this.setState({
      record,
      addModalVisible:!!flag,
    });
    if(refresh){
      this.list({});
    }
  }

  render() {
    const {
      wordType: { data },
      loading,
    } = this.props;

    const { selectedRows,addModalVisible,record} = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                disabled={loading}
                icon={<PlusOutlined />}
                onClick={() => this.handleModalVisible(true,false)}
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
        {
          addModalVisible && <CreateForm modalVisible={addModalVisible} onCancel={(modalVisible:boolean,refresh:boolean)=>this.handleModalVisible(modalVisible,refresh)} />
        }
        {
          record && Object.keys(record).length>0 && addModalVisible && <UpdateForm values={record} modalVisible={addModalVisible} onCancel={(modalVisible:boolean,refresh:boolean)=>this.handleUpdateModalVisible({},modalVisible,refresh)} />
        }
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    wordType,
    loading,
  }: {
    wordType: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    wordType,
    loading:
      loading.effects['wordType/list'] ||
      loading.effects['wordType/disabled'] ||
      loading.effects['wordType/enabled'] ||
      loading.effects['wordType/save'] ||
      loading.effects['wordType/update'],
  }),
)(TableList);
