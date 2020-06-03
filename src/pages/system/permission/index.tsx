import { Button, Card, Col, Row, message, Tag, Modal, Divider, Tree } from 'antd';
import { PlusOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component, Fragment } from 'react';

import { Dispatch, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { getSiteInfo } from '@/utils/common';
import { history } from '@@/core/history';
import { ColumnProps } from 'antd/es/table';
import { StateType } from './model';
import StandardTable from './components/StandardTable';

import { MenuTree, TableListItem } from './data.d';

import styles from './style.less';

interface TableListProps {
  dispatch: Dispatch;
  loading: boolean;
  permission: StateType;
}

interface TableListState {
  menuTree: MenuTree[];
  tableTitle: string;
  menuId: number | '';
}

class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    menuTree: [],
    tableTitle: '',
    menuId: '',
  };

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '菜单名',
      dataIndex: 'menuName',
    },
    {
      title: '权限名',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        if (text === 0) {
          return '按钮';
        }
        if (text === 1) {
          return '接口';
        }
        return text;
      },
    },
    {
      title: '路由/编号',
      dataIndex: 'urls',
      render: (text) => {
        return text.map((item: string) => (
          <div
            style={{
              background: '#fafafa',
              border: 'solid 1px #d9d9d9',
              marginBottom: 2,
              paddingLeft: 4,
              borderRadius: 2,
            }}
            key={`${item}`}
          >
            {item}
          </div>
        ));
      },
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      width: 60,
      render: (text, record) => (
        <>
          {text ? <Tag color="#108ee9">启用</Tag> : <Tag color="#f50">禁用</Tag>}
          {record.isChecked ? <Tag color="#108ee9">校验</Tag> : <Tag color="#f50">不校验</Tag>}
        </>
      ),
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
          <a onClick={() => history.push(`/system/permission/edit/${record.id}`)}>编辑</a>
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
    const { menuId } = this.state;
    dispatch({
      type: 'permission/list',
      payload: {
        menuId,
        ...params,
      },
    });
  };

  tree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/menuTree',
      callback: (response: MenuTree[]) => {
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
          type: `permission/${type1}`,
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

  renderTree = (menuTree: MenuTree[]) => {
    return menuTree.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode key={item.id} title={item.name}>
            {this.renderTree(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.id} title={item.name} />;
    });
  };

  onSelectTreeNode = (selectedKeys: string[], e: { selected: boolean; selectedNodes: any }) => {
    const { selectedNodes } = e;
    this.list({
      menuId: selectedKeys.join(','),
    });

    if (selectedNodes[0]) {
      this.setState({
        tableTitle: selectedNodes[0].title === '全部菜单' ? '' : selectedNodes[0].title,
        menuId: selectedNodes[0].key,
      });
    } else {
      this.setState({
        tableTitle: '',
        menuId: '',
      });
    }
  };

  render() {
    const {
      permission: { data },
      loading,
    } = this.props;

    const { menuTree, tableTitle } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false} size="small">
                <Tree showLine defaultExpandAll onSelect={this.onSelectTreeNode}>
                  <Tree.TreeNode key="" title="全部菜单">
                    {this.renderTree(menuTree)}
                  </Tree.TreeNode>
                </Tree>
              </Card>
            </Col>
            <Col span={18}>
              <Card
                bordered={false}
                size="small"
                title={tableTitle ? <h1>菜单 {tableTitle} 的权限</h1> : <h1>全部权限</h1>}
              >
                <div className={styles.tableList}>
                  <div className={styles.tableListOperator}>
                    <Button
                      disabled={loading}
                      icon={<PlusOutlined />}
                      onClick={() => history.push('/system/permission/add')}
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
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    permission,
    loading,
  }: {
    permission: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    permission,
    loading:
      loading.effects['permission/list'] ||
      loading.effects['permission/disabled'] ||
      loading.effects['permission/enabled'] ||
      loading.effects['permission/reset'] ||
      loading.effects['permission/save'] ||
      loading.effects['permission/update'],
  }),
)(TableList);
