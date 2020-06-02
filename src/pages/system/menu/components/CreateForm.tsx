import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Radio, InputNumber, Checkbox, TreeSelect } from 'antd';
import { Dispatch, connect } from 'umi';
import { StateType } from '@/pages/system/menu/model';
import { TableListItem } from '@/pages/system/menu/data';
import { TreeNodeItem } from '@/utils/common';

const FormItem = Form.Item;

interface AddFormProps {
  record: TableListItem;
  modalVisible: boolean;
  onCancel: (modalVisible: boolean, refresh: boolean) => void;
  dispatch: Dispatch;
}

const CreateForm: React.FC<AddFormProps> = (props) => {
  const [menuTree, setMenuTree] = useState<TreeNodeItem[]>([]);
  const [values, setValues] = useState<TableListItem>({});

  const [form] = Form.useForm();
  const { dispatch } = props;

  useEffect(() => {
    const { record } = props;

    if (dispatch) {
      if (record) {
        dispatch({
          type: 'menu/edit',
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
        type: 'menu/tree',
        callback: (response: TreeNodeItem[]) => {
          setMenuTree(response);
        },
      });
    }
  }, []);

  const renderTreeSelect = (treeSelect: TreeNodeItem[]) => {
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
            type: 'menu/save',
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
      width={580}
      destroyOnClose
      maskClosable={false}
      title="新建菜单"
      visible={modalVisible}
      onCancel={() => onCancel(false, false)}
      onOk={save}
    >
      <Form
        form={form}
        initialValues={{
          isEnabled: true,
          order: 1,
          id: values.id || '',
          target: '_self',
        }}
      >
        <FormItem name="id" style={{ display: 'none' }}>
          <Input type="hidden" />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上级菜单"
          name="parentId"
          initialValue={values.parentId || ''}
        >
          <TreeSelect showSearch showArrow treeLine treeDefaultExpandAll placeholder="请上级部门">
            {renderTreeSelect(menuTree)}
          </TreeSelect>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="菜单名称"
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
        <FormItem style={{ display: 'none' }} {...formItemLayout} label="菜单图标" name="icon">
          <Input />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="路由"
          name="url"
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
          label="菜单KEY"
          name="menuKey"
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="组件" name="component">
          <Input />
        </FormItem>
        <FormItem
          {...formItemLayout}
          style={{ display: 'none' }}
          label="打开方式"
          name="target"
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="_self">当前窗口</Radio>
            <Radio value="_blank">新窗口</Radio>
            <Radio value="_parent">父级窗口</Radio>
            <Radio value="_top">顶级窗口</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="序号"
          name="order"
          rules={[
            {
              required: true,
              message: '必填',
            },
          ]}
        >
          <InputNumber min={1} precision={0} step={1} style={{ width: '100%' }} />
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
};
export default connect(
  ({ menu, loading }: { menu: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    menu,
    submitting:
      loading.effects['menu/save'] || loading.effects['menu/edit'] || loading.effects['menu/tree'],
  }),
)(CreateForm);
