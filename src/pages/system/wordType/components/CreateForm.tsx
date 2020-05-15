import React from 'react';
import {Modal, Form, Input, message, Checkbox} from "antd";
import {Dispatch,connect} from 'umi';
import {StateType} from "@/pages/system/department/model";

const FormItem = Form.Item;

interface AddFormProps {
  modalVisible:boolean;
  onCancel:(modalVisible:boolean,refresh:boolean)=>void;
  dispatch: Dispatch<any>;
}

interface ConnectState {
  wordType:StateType;
  loading: {
    models: { [key: string]: boolean };
  };
}

const CreateForm:React.FC<AddFormProps> = (props) =>{
  const [form] = Form.useForm();
  const {
    dispatch,
  } = props;

  const { modalVisible, onCancel } = props;

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

  const save=()=>{
    form.validateFields().then(values => {
      if (dispatch) {
        dispatch({
          type: 'wordType/save',
          payload:values,
          callback: (response: { type: string; content: string }) => {
            const { type, content } = response;
            if (type === 'success') {
              onCancel(false,true);
            } else {
              message.error(content);
            }
          },
        });
      }
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  }


  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title='新建字典分类'
      visible={modalVisible}
      onCancel={() => onCancel(false,false)}
      onOk={save}
    >
      <Form
        form={form}
        initialValues={{
          isEnabled: true,
        }}
      >
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
            style={{ display: 'inline-block', width: 'calc(15% - 8px)' }}
          >
            <Checkbox>启用</Checkbox>
          </FormItem>
        </FormItem>
      </Form>
    </Modal>
  );
}
export default connect(({ wordType, loading }: ConnectState) => ({
  wordType,
  loading: loading.models.wordType,
}))(CreateForm);
