import React, { Component } from 'react';
import { Form, Input, message, Card, Button, Alert, Select, Radio } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { TableListItem } from '../data';
import { StateType } from '../model';

const FormItem = Form.Item;

interface Project {
  id: number;
  name: string;
}

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
  projects: Project[];
}

class CreateFrom extends Component<CreateFromProps, CreateFromState> {
  formRef = React.createRef<FormInstance>();

  state = {
    projects: [],
  };

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    dispatch({
      type: 'entity/project',
      payload: params,
      callback: (response: Project[]) => {
        this.setState({
          projects: response,
        });
      },
    });
    if (params && Object.keys(params).length > 0 && params.id) {
      dispatch({
        type: 'entity/edit',
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
      type: 'entity/save',
      payload: values,
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/code/entity');
        } else {
          message.error(content);
        }
      },
    });
  };

  render() {
    const { submitting } = this.props;
    const { projects } = this.state;
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
          <Alert
            style={{ marginBottom: 24 }}
            type="info"
            showIcon
            message="目前代码工具只支持自动生成Spring Boot和 Ant Design pro4 ts版"
          />
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            initialValues={{
              status: 0,
              parentClass: 'BaseEntity',
            }}
          >
            <FormItem name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属项目"
              name="projectId"
              help="设置完成之后，不能修改"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Select>
                {projects.map((item: Project) => (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="模块中文名"
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
              label="模块英文名"
              name="alias"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
                {
                  pattern: /^[A-Za-z]+$/,
                  message: '只能是字母',
                },
              ]}
              help="系统根据该名称生成表，表名称：表前缀_模块英文名"
            >
              <Input />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="模块描述"
              name="memo"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              help="系统根据描述来生成注释"
            >
              <Input />
            </FormItem>
            <FormItem {...formItemLayout} label="父类" name="parentClass">
              <Radio.Group>
                <Radio value="BaseEntity">BaseEntity</Radio>
                <Radio value="OrderedEntity">OrderedEntity</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem {...submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => history.push('/code/entity')} style={{ marginLeft: 8 }}>
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
    entity,
    loading,
  }: {
    entity: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    entity,
    submitting: loading.effects['entity/save'] || loading.effects['entity/project'],
  }),
)(CreateFrom);
