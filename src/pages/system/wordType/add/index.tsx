import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Checkbox, message, Card, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Dispatch, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { TableListItem } from '../data';
import { StateType } from '../model';

const FormItem = Form.Item;

interface CreateFromProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
  match: {
    params: {
      [key: string]: any;
    };
  };
}

interface CreateFromState {}

class CreateFrom extends Component<CreateFromProps, CreateFromState> {
  formRef = React.createRef<FormInstance>();

  componentDidMount(): void {
    const {
      dispatch,
      match: { params = {} },
    } = this.props;
    if (params && Object.keys(params).length > 0 && params.id) {
      dispatch({
        type: 'wordType/edit',
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
      type: 'wordType/save',
      payload: values,
      callback: (response: { type: string; content: string }) => {
        const { type, content } = response;
        if (type === 'success') {
          history.push('/system/wordType');
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
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            initialValues={{
              isEnabled: true,
            }}
          >
            <FormItem name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </FormItem>

            <FormItem {...submitFormLayout}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => history.push('/system/wordType')} style={{ marginLeft: 8 }}>
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
    wordType,
    loading,
  }: {
    wordType: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    wordType,
    submitting: loading.effects['wordType/save'] || loading.effects['wordType/all'],
  }),
)(CreateFrom);
