import React, { Component } from 'react';
import {
  Form,
  Input,
  Checkbox,
  message,
  TreeSelect,
  Card,
  Button,
  Divider,
  Row,
  Col,
  Alert,
  Select,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history, connect } from 'umi';
import { DepartmentTree } from '@/pages/system/department/data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getSiteInfo } from '@/utils/common';
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

interface RoleList {
  id: number;
  name: string;
}

interface CreateFromState {
  departmentTree: DepartmentTree[];
  roleList: RoleList[];
  postList: RoleList[];
  readonly: boolean;
}

class CreateFrom extends Component<CreateFromProps, CreateFromState> {
  formRef = React.createRef<FormInstance>();

  state: CreateFromState = {
    departmentTree: [],
    roleList: [],
    postList: [],
    readonly: false,
  };

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'admin/departmentTree',
      callback: (response: DepartmentTree[]) => {
        this.setState({
          departmentTree: response,
        });
      },
    });
    dispatch({
      type: 'admin/roleList',
      callback: (response: RoleList[]) => {
        this.setState({
          roleList: response,
        });
      },
    });
    dispatch({
      type: 'admin/postList',
      callback: (response: RoleList[]) => {
        this.setState({
          postList: response,
        });
      },
    });
    if (params && Object.keys(params).length > 0 && params.id) {
      dispatch({
        type: 'admin/edit',
        payload: params,
        callback: (response: TableListItem) => {
          this.setState({
            readonly: true,
          });
          const { current } = this.formRef;
          if (current) {
            current.setFieldsValue(response);
          }
        },
      });
    } else {
      dispatch({
        type: 'admin/add',
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
      type: 'admin/save',
      payload: values,
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/system/admin');
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

  render() {
    const { submitting } = this.props;
    const { departmentTree, roleList, readonly, postList } = this.state;
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
          <Alert showIcon type="info" message={`默认密码是${getSiteInfo('defaultPassword')}`} />
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            initialValues={{
              isEnabled: true,
              isLocked: false,
            }}
          >
            <FormItem name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </FormItem>
            <Divider orientation="left" style={{ color: '#0189ff', fontWeight: 600 }}>
              基础信息
            </Divider>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="所属部门"
                  name="departmentId"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                >
                  <TreeSelect showSearch showArrow treeLine treeDefaultExpandAll>
                    {this.renderTreeSelect(departmentTree)}
                  </TreeSelect>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="用户名"
                  name="username"
                  extra="设置完成之后，不能修改"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                    {
                      min: 4,
                      message: '用户名长度不能少于4个字符',
                    },
                    {
                      max: 20,
                      message: '用户名长度不能超过20个字符',
                    },
                  ]}
                >
                  <Input readOnly={readonly} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="角色"
                  name="roleIds"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                >
                  <Select mode="multiple" showSearch showArrow>
                    {roleList.map((item) => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="员工编号"
                  name="cardNo"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                  extra="由系统生成，不能修改"
                >
                  <Input readOnly />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="所属岗位"
                  name="postId"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                >
                  <Select showSearch showArrow>
                    {postList.map((item) => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Divider orientation="left" style={{ color: '#0189ff', fontWeight: 600 }}>
              详细信息
            </Divider>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="姓名"
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
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="联系电话"
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="邮箱"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Divider orientation="left" style={{ color: '#0189ff', fontWeight: 600 }}>
              其他信息
            </Divider>
            <Row gutter={8}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="设置" style={{ marginBottom: 0 }}>
                  <FormItem
                    name="isEnabled"
                    valuePropName="checked"
                    style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
                  >
                    <Checkbox>启用</Checkbox>
                  </FormItem>
                  <FormItem
                    name="isLocked"
                    valuePropName="checked"
                    style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
                  >
                    <Checkbox>锁定</Checkbox>
                  </FormItem>
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => history.push('/system/admin')} style={{ marginLeft: 8 }}>
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
  ({ admin, loading }: { admin: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    admin,
    submitting: loading.effects['admin/save'] || loading.effects['admin/departmentTree'],
  }),
)(CreateFrom);
