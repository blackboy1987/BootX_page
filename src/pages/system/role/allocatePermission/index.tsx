import React, { Component, ReactText } from 'react';
import { message, Modal, Tabs, Tree } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history, connect } from 'umi';
import { TableListItem } from '../data';
import { StateType } from '../model';

interface Permission {
  id: number;
  name: string;
  type: number;
}

interface MenuTree {
  id: number;
  name: string;
  children: MenuTree[];
  permissions: Permission[];
}

interface CreateFromProps {
  allocatePermissionModalVisible: boolean;
  allocatePermissionRecord: TableListItem;
  onClose: () => void;
  submitting: boolean;
  dispatch: Dispatch;
  match: {
    params: {
      [key: string]: any;
    };
  };
}

interface CreateFromState {
  menuTree: MenuTree[];
  permissionList: {
    buttonList: string[];
    interfaceList: string[];
    menuList: number[];
  };
}

class AllocationPermission extends Component<CreateFromProps, CreateFromState> {
  formRef = React.createRef<FormInstance>();

  state: CreateFromState = {
    menuTree: [],
    permissionList: {
      buttonList: [],
      interfaceList: [],
      menuList: [],
    },
  };

  componentDidMount(): void {
    const { dispatch, allocatePermissionRecord } = this.props;
    dispatch({
      type: 'role/permission',
      payload: {
        roleId: allocatePermissionRecord.id,
      },
      callback: (response: {
        menuTree: MenuTree[];
        permissionIds: string[];
        menuList: number[];
      }) => {
        const { menuTree = [], permissionIds = [], menuList = [] } = response;
        this.setState({
          menuTree,
          permissionList: {
            buttonList: permissionIds,
            interfaceList: permissionIds,
            menuList,
          },
        });
      },
    });
  }

  onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/save',
      payload: values,
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/system/role');
        } else {
          message.error(content);
        }
      },
    });
  };

  renderTree = (menuTree: MenuTree[], type: number) => {
    return menuTree.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode key={`${item.id}_${type}`} title={item.name}>
            {item.permissions
              .filter((permission) => permission.type === type)
              .map((permission1) => (
                <Tree.TreeNode
                  key={`${item.id}_${permission1.id}_${type}`}
                  title={`${item.name}=${permission1.name}=${permission1.type}`}
                />
              ))}
            {this.renderTree(item.children, type)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode key={`${item.id}_${type}`} title={item.name}>
          {item.permissions
            .filter((permission) => permission.type === type)
            .map((permission1) => (
              <Tree.TreeNode
                key={`${item.id}_${permission1.id}_${type}`}
                title={`${item.name}=${permission1.name}=${permission1.type}`}
              />
            ))}
        </Tree.TreeNode>
      );
    });
  };

  renderTree1 = (menuTree: MenuTree[]) => {
    return menuTree.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode key={`${item.id}`} title={item.name}>
            {this.renderTree1(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={`${item.id}`} title={item.name} />;
    });
  };

  onCheck = (type: string, checkedKeys: ReactText[]) => {
    const { permissionList } = this.state;
    const newPermissionList = { ...permissionList };
    newPermissionList[`${type}`] = checkedKeys;
    console.log(newPermissionList, '11', type);
    this.setState({
      permissionList: newPermissionList,
    });
  };

  ok = () => {
    const { permissionList } = this.state;
    const { dispatch, allocatePermissionRecord, onClose } = this.props;
    dispatch({
      type: 'role/updatePermission',
      payload: {
        roleId: allocatePermissionRecord.id,
        ...permissionList,
      },
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          message.success(content);
          onClose();
        } else {
          message.error(content);
        }
      },
    });
  };

  render() {
    const {
      submitting,
      allocatePermissionRecord,
      allocatePermissionModalVisible,
      onClose,
    } = this.props;
    const {
      menuTree,
      permissionList: { buttonList = [], interfaceList = [], menuList = [] },
    } = this.state;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        visible={allocatePermissionModalVisible}
        title={`角色 ${allocatePermissionRecord.name} 权限配置`}
        onCancel={onClose}
        onOk={this.ok}
        okText="确定"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Tabs>
          <Tabs.TabPane tab="菜单权限" key="-1">
            <Tree
              checkedKeys={menuList.map((item) => `${item}`)}
              showIcon
              showLine
              checkable
              multiple
              onCheck={(checkedKeys: ReactText[]) => this.onCheck('menuList', checkedKeys)}
            >
              {this.renderTree1(menuTree)}
            </Tree>
          </Tabs.TabPane>
          <Tabs.TabPane tab="按钮权限" key="0">
            <Tree
              checkedKeys={buttonList}
              showIcon
              showLine
              checkable
              multiple
              onCheck={(checkedKeys: ReactText[]) => this.onCheck('buttonList', checkedKeys)}
            >
              {this.renderTree(menuTree, 0)}
            </Tree>
          </Tabs.TabPane>
          <Tabs.TabPane tab="接口权限" key="1">
            <Tree
              checkedKeys={interfaceList}
              showIcon
              showLine
              checkable
              multiple
              onCheck={(checkedKeys: ReactText[]) => this.onCheck('interfaceList', checkedKeys)}
            >
              {this.renderTree(menuTree, 1)}
            </Tree>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default connect(
  ({ role, loading }: { role: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    role,
    submitting: loading.effects['role/updatePermission'] || loading.effects['role/permission'],
  }),
)(AllocationPermission);
