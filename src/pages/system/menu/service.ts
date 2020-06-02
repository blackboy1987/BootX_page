import request from '@/utils/request';
import constants from '@/utils/constants';
import { TableListParams } from './data.d';

export async function list(params: TableListParams) {
  return request(`${constants.authUrl}menu/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function save(params: TableListParams) {
  if (params.id) {
    return request(`${constants.authUrl}menu/update`, {
      method: 'POST',
      data: {
        ...params,
      },
    });
  }
  return request(`${constants.authUrl}menu/save`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function edit(params: TableListParams) {
  return request(`${constants.authUrl}menu/edit`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function remove(params: TableListParams) {
  return request(`${constants.authUrl}menu/delete`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function enabled(params: TableListParams) {
  return request(`${constants.authUrl}menu/enabled`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function disabled(params: TableListParams) {
  return request(`${constants.authUrl}menu/disabled`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function tree(params: TableListParams) {
  return request(`${constants.authUrl}menu/tree`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
