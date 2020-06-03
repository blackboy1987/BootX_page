import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Checkbox, TreeSelect } from 'antd';
import { Dispatch, connect } from 'umi';
import { StateType } from '@/pages/system/post/model';
import { DepartmentTree } from '@/pages/system/department/data';
import { TableListItem } from '@/pages/system/post/data';

const FormItem = Form.Item;

interface AddFormProps {
  record: TableListItem;
  modalVisible: boolean;
  onCancel: (modalVisible: boolean, refresh: boolean) => void;
  dispatch: Dispatch;
}

const CreateForm: React.FC<AddFormProps> = (props) => {
  const [departmentTree, setDepartmentTree] = useState<DepartmentTree[]>([]);
  const [values, setValues] = useState<TableListItem>({});

  const [form] = Form.useForm();
  const { dispatch } = props;

  useEffect(() => {
    const { record } = props;

    if (dispatch) {
      if (record) {
        dispatch({
          type: 'post/edit',
          payload: {
            id: record.id,
          },
          callback: (response: TableListItem) => {
            setValues(response);
            form.setFieldsValue(response);
          },
        });
      }

      dispatch({
        type: 'post/departmentTree',
        callback: (response: DepartmentTree[]) => {
          setDepartmentTree(response);
        },
      });
    }
  }, []);

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

  const save = () => {
    form
      .validateFields()
      .then((formValues) => {
        if (dispatch) {
          dispatch({
            type: 'role/save',
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
      title="新建角色"
      visible={modalVisible}
      onCancel={() => onCancel(false, false)}
      onOk={save}
    >
      <Form
        form={form}
        initialValues={{
          isEnabled: true,
          order: 1,
          level: 3,
          id: values.id || '',
        }}
      >
        <FormItem name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属部门"
          name="departmentId"
          initialValue={values.departmentId || ''}
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <TreeSelect showSearch showArrow treeLine treeDefaultExpandAll placeholder="请选择部门">
            {renderTreeSelect(departmentTree)}
          </TreeSelect>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色名"
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
        <FormItem {...formItemLayout} label="备注" name="description">
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
          <FormItem
            name="isSystem"
            valuePropName="checked"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Checkbox>管理员角色</Checkbox>
          </FormItem>
        </FormItem>
      </Form>
    </Modal>
  );
};
export default connect(
  ({ post, loading }: { post: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    post,
    submitting:
      loading.effects['role/save'] ||
      loading.effects['role/edit'] ||
      loading.effects['role/departmentTree'],
  }),
)(CreateForm);
