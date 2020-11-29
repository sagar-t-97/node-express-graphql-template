import get from 'lodash/get';
import { storesTable } from '@server/utils/testUtils/mockData';
import { getResponse } from '@utils/testUtils';

beforeEach(() => {
  const mockDBClient = require('@database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...storesTable }] }]);
  jest.doMock('@database', () => ({ client, getClient: () => client }));
});

describe('store graphQL-server-DB query tests', () => {
  const storeName = `
  query {
    store (id: 1) {
      id
      name
    }
  }
  `;
  const allFields = `
  query {
    store (id: 1) {
      id
      name
      addressId
      createdAt
      updatedAt
      deletedAt
    }
  }
  `;

  it('should return the fields mentioned in the query', async done => {
    await getResponse(storeName).then(response => {
      const result = get(response, 'body.data.store');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'name']);
      done();
    });
  });

  it('should return all the valid fields in the model definition', async done => {
    await getResponse(allFields).then(response => {
      const result = get(response, 'body.data.store');
      const resultFields = Object.keys(result);
      expect(resultFields).toEqual(['id', 'name', 'addressId', 'createdAt', 'updatedAt', 'deletedAt']);
      done();
    });
  });
});