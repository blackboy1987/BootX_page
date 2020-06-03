import { Button, Card, Form, message, InputNumber } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormInstance } from 'antd/lib/form';
import { Link, Dispatch, connect } from 'umi';

const FormItem = Form.Item;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch;
}

class BasicForm extends Component<BasicFormProps> {
  formRef = React.createRef<FormInstance>();

  componentDidMount(): void {
    const { dispatch } = this.props;
    const { current } = this.formRef;
    dispatch({
      type: 'storagePlugin/setting',
      payload: {
        url: '/local_storage/setting',
      },
      callback: (response: { [key: string]: any }) => {
        const { order } = response;
        // @ts-ignore
        current.setFieldsValue({
          order,
        });
      },
    });
  }

  handleSubmit = (values: { [key: string]: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storagePlugin/update',
      payload: {
        ...values,
        plugin: 'local_storage',
      },
      callback: (response: { content: string; type: string }) => {
        const { content, type } = response;
        if (type === 'success') {
          message.success(content);
          this.componentDidMount();
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper title={false}>
        <Card bordered={false}>
          <Form ref={this.formRef} onFinish={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              label="排序"
              name="order"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <InputNumber step={1} precision={0} style={{ width: '100%' }} />
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Link to="/system/storagePlugin">
                <Button style={{ marginLeft: 8 }}>返回</Button>
              </Link>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({ storagePlugin, loading }: { storagePlugin: any; loading: { effects: {} } }) => ({
    storagePlugin,
    submitting: loading.effects['storagePlugin/setting'] || loading.effects['storagePlugin/update'],
  }),
)(BasicForm);
