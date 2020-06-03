import React, { Component } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch, connect } from 'umi';
import { StateType } from './model';

interface TableListProps {
  match: {
    params: {
      [key: string]: string;
    };
  };
  dispatch: Dispatch;
  loading: boolean;
  setting: StateType;
}

class TableList extends Component<TableListProps> {
  componentDidMount() {
    this.list({});
  }

  list = (params: {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/edit',
      payload: params,
    });
  };

  render() {
    return <PageHeaderWrapper title={false}>setting</PageHeaderWrapper>;
  }
}

export default connect(
  ({
    setting,
    loading,
  }: {
    setting: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    setting,
    loading: loading.effects['setting/edit'] || loading.effects['setting/update'],
  }),
)(TableList);
