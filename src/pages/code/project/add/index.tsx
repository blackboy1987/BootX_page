import React, { Component } from 'react';
import { Form, Input, message, Card, Button, Alert, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history, connect } from 'umi';
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

class CreateFrom extends Component<CreateFromProps> {
  formRef = React.createRef<FormInstance>();

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    if (params && Object.keys(params).length > 0 && params.id) {
      dispatch({
        type: 'project/edit',
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
      type: 'project/save',
      payload: values,
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/code/project');
        } else {
          message.error(content);
        }
      },
    });
  };

  render() {
    const { submitting } = this.props;
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
              dataSourceType: 'mysql',
            }}
          >
            <FormItem name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="数据源"
              name="dataSourceType"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Select>
                <Select.Option value="mysql">mysql</Select.Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="项目名"
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
              label="项目描述"
              name="memo"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="项目包名"
              name="packageName"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              help="格式：com.bootx"
            >
              <Input />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="表前缀"
              name="tablePrefix"
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
              label="状态"
              name="status"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>未开始</Radio>
                <Radio value={1}>进行中</Radio>
                <Radio value={2}>已结束</Radio>
                <Radio value={3}>已挂起</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem {...submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => history.push('/code/project')} style={{ marginLeft: 8 }}>
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
    project,
    loading,
  }: {
    project: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    project,
    submitting: loading.effects['project/save'] || loading.effects['project/edit'],
  }),
)(CreateFrom);
