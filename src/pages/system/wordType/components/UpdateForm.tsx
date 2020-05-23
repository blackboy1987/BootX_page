import React, { useEffect } from 'react';
import { Modal, Form, Input, message, Checkbox } from 'antd';
import { Dispatch, connect } from 'umi';
import { TableListItem } from '@/pages/system/wordType/data';
import { StateType } from '@/pages/system/wordType/model';

const FormItem = Form.Item;

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: (modalVisible: boolean, refresh: boolean) => void;
  dispatch: Dispatch<any>;
  values: TableListItem;
}

interface ConnectState {
  wordType: StateType;
  loading: {
    models: { [key: string]: boolean };
  };
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { dispatch } = props;

  const { modalVisible, onCancel, values } = props;

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

  useEffect(() => {
    if (dispatch) {
      if (values && values.id) {
        dispatch({
          type: 'wordType/edit',
          payload: values,
          callback: (response: TableListItem) => {
            if (form) {
              form.setFieldsValue(response);
            }
          },
        });
      }
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then((formValues: { [key: string]: any }) => {
        if (dispatch) {
          dispatch({
            type: 'wordType/save',
            payload: formValues,
            callback: (response: { type: string; content: string }) => {
              const { type, content } = response;
              if (type === 'success') {
                onCancel(false, true);
              } else {
                message.error(content);
              }
            },
          });
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="修改分类"
      visible={modalVisible}
      onCancel={() => onCancel(false, false)}
      onOk={save}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form}>
        <FormItem name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="分类名"
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
        <FormItem {...formItemLayout} label="描述" name="description">
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
        </FormItem>
        <FormItem {...formItemLayout} label="设置" style={{ marginBottom: 0 }}>
          <FormItem
            name="isEnabled"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Checkbox>启用</Checkbox>
          </FormItem>
        </FormItem>
      </Form>
    </Modal>
  );
};
export default connect(({ wordType, loading }: ConnectState) => ({
  wordType,
  loading: loading.models.wordType,
}))(UpdateForm);
