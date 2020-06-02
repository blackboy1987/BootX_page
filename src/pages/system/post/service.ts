import request from '@/utils/request';
import constants from '@/utils/constants';
import { TableListParams } from './data.d';

export async function list(params: TableListParams) {
  return request(`${constants.baseUrl}post/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function save(params: TableListParams) {
  if (params.id) {
    return request(`${constants.baseUrl}post/update`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }
  return request(`${constants.baseUrl}post/save`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function tree(params: TableListParams) {
  return request(`${constants.baseUrl}post/tree`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: TableListParams) {
  return request(`${constants.baseUrl}post/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function remove(params: TableListParams) {
  return request(`${constants.baseUrl}post/delete`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function departmentTree(params: TableListParams) {
  return request(`${constants.baseUrl}department/tree`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
