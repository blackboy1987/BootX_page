import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, message, TreeSelect, InputNumber, Checkbox} from "antd";
import {Dispatch,connect} from 'umi';
import {DepartmentTree} from "@/pages/system/department/data";
import {StateType} from "@/pages/system/department/model";

const FormItem = Form.Item;

interface AddFormProps {
  modalVisible:boolean;
  onCancel:(modalVisible:boolean,refresh:boolean)=>void;
  dispatch: Dispatch<any>;
}

interface ConnectState {
  department:StateType;
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
  const [departmentTree,setDepartmentTree] = useState<DepartmentTree[]>([]);

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

  const renderTreeSelect = (treeSelect: DepartmentTree[]) => {
    return treeSelect.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeSelect.TreeNode value={item.id} key={item.id} title={item.name}>
            {renderTreeSelect(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={item.id} key={item.id} title={item.name} />;
    });
  };


  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'department/tree',
        callback: (response: DepartmentTree[]) => {
          setDepartmentTree(response)
        },
      });
    }
  }, []);

  const save=()=>{
    form.validateFields().then(values => {
      if (dispatch) {
        dispatch({
          type: 'department/save',
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
      title='新建部门'
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
        <FormItem name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </FormItem>
        <FormItem {...formItemLayout} label="上级部门" name="parentId">
          <TreeSelect showSearch showArrow treeLine treeDefaultExpandAll>
            {renderTreeSelect(departmentTree)}
          </TreeSelect>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名称"
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
          label="排序"
          name="order"
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <InputNumber min={0} step={1} precision={0} style={{ width: '100%' }} />
        </FormItem>
        <FormItem {...formItemLayout} label="设置" style={{ marginBottom: 0 }}>
          <FormItem
            name="isEnabled"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}
          >
            <Checkbox>启用</Checkbox>
          </FormItem>
        </FormItem>
      </Form>
    </Modal>
  );
}
export default connect(({ department, loading }: ConnectState) => ({
  department,
  loading: loading.models.department,
}))(CreateForm);
