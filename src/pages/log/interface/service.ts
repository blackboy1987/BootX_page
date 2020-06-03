import request from '@/utils/request';
import constants from '@/utils/constants';
import { TableListParams } from './data.d';

export async function list(params: TableListParams) {
  return request(`${constants.baseUrl}/log/list`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
