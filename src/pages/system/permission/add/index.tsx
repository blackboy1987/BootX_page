import React, { Component } from 'react';
import { Form, Input, Checkbox, message, TreeSelect, Card, Button, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history, connect } from 'umi';
import { DepartmentTree } from '@/pages/system/department/data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { TableListItem } from '../data';
import { StateType } from '../model';

const FormItem = Form.Item;

interface CreateFromProps {
  submitting: boolean;
  dispatch: Dispatch;
  match: {
    params: {
      [key: string]: any;
    };
  };
}

interface CreateFromState {
  menuTree: DepartmentTree[];
  type: string;
}

class CreateFrom extends Component<CreateFromProps, CreateFromState> {
  formRef = React.createRef<FormInstance>();

  state: CreateFromState = {
    menuTree: [],
    type: '0',
  };

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'permission/menuTree',
      callback: (response: DepartmentTree[]) => {
        this.setState({
          menuTree: response,
        });
      },
    });
    if (params && Object.keys(params).length > 0 && params.id) {
      dispatch({
        type: 'permission/edit',
        payload: params,
        callback: (response: TableListItem) => {
          const { current } = this.formRef;
          if (current) {
            current.setFieldsValue(response);
          }
        },
      });
    }
  }

  onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/save',
      payload: {
        ...values,
        urls: values.urls.replace(/\n/g, ';').replace(/\r\n/g, ';').split(';'),
      },
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/system/permission');
        } else {
          message.error(content);
        }
      },
    });
  };

  renderTreeSelect = (treeSelect: DepartmentTree[]) => {
    return treeSelect.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeSelect.TreeNode value={item.id} key={item.id} title={item.name}>
            {this.renderTreeSelect(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={item.id} key={item.id} title={item.name} />;
    });
  };

  onValuesChange = (changedValues: { [key: string]: any }) => {
    const { type } = changedValues;
    this.setState({
      type,
    });
  };

  render() {
    const { submitting } = this.props;
    const { menuTree, type } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 6 },
      },
    };
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            onValuesChange={this.onValuesChange}
            initialValues={{
              isEnabled: true,
              type: '0',
              isChecked: true,
            }}
          >
            <FormItem name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单"
              name="menuId"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <TreeSelect showSearch showArrow treeLine treeDefaultExpandAll>
                {this.renderTreeSelect(menuTree)}
              </TreeSelect>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限类型"
              name="type"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group>
                <Radio value="0">按钮</Radio>
                <Radio value="1">接口</Radio>
                <Radio value="2">数据</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={type === '1' ? '路由' : '编号'}
              name="urls"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
            </FormItem>
            <FormItem {...formItemLayout} label="描述" name="memo">
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
            </FormItem>
            <FormItem {...formItemLayout} label="设置" style={{ marginBottom: 0 }}>
              <FormItem
                name="isEnabled"
                valuePropName="checked"
                style={{ display: 'inline-block', width: 'calc(20% - 8px)' }}
              >
                <Checkbox>启用</Checkbox>
              </FormItem>
              <FormItem
                name="isChecked"
                valuePropName="checked"
                style={{ display: 'inline-block', width: 'calc(20% - 8px)' }}
              >
                <Checkbox>校验</Checkbox>
              </FormItem>
            </FormItem>

            <FormItem {...submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => history.push('/system/permission')} style={{ marginLeft: 8 }}>
                返回
              </Button>
            </FormItem>
          </Form>
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
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    permission,
    submitting: loading.effects['permission/save'] || loading.effects['permission/menuTree'],
  }),
)(CreateFrom);
