import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';

import { FormInstance } from 'antd/lib/form';

import { handleSearch } from '@/utils/common';
import styles from './style.less';

const FormItem = Form.Item;

interface SelectItem {
  text: string;
  value: any;
}

export interface SearchColumns {
  name: string;
  title: string;
  initialValue?: any;
  type: 'input' | 'numberNumber' | 'date' | 'select';
  span?: number;
  selectItems?: SelectItem[];
}

interface ListListSearchProps {
  submit: (formValues: { [key: string]: any }) => void;
  searchColumns: SearchColumns[];
}

interface ListListSearchState {}

class ListSearch extends Component<ListListSearchProps, ListListSearchState> {
  formRef = React.createRef<FormInstance>();

  handleSearch = (values: { [key: string]: any }) => {
    const { submit } = this.props;
    submit(handleSearch(values || {}));
  };

  render() {
    const { searchColumns } = this.props;

    return (
      <Form ref={this.formRef} onFinish={this.handleSearch}>
        <Row gutter={16}>
          {searchColumns.map((item) => {
            if (item.type === 'input') {
              return (
                <Col key={item.name} span={item.span || 8}>
                  <FormItem label={item.title} name={item.name}>
                    <Input placeholder="请输入" />
                  </FormItem>
                </Col>
              );
            }
            if (item.type === 'select') {
              return (
                <Col key={item.name} span={item.span || 8}>
                  <FormItem label={item.title} name={item.name} initialValue={item.initialValue}>
                    <Select>
                      {item.selectItems?.map((selectItem) => (
                        <Select.Option value={selectItem.value}>{selectItem.text}</Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
              );
            }
            return (
              <Col key={item.name} span={item.span || 8}>
                <FormItem label={item.title} name={item.name}>
                  <Input placeholder="请输入" />
                </FormItem>
              </Col>
            );
          })}
          <Col span={2}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default ListSearch;
