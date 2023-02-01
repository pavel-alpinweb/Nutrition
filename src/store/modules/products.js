import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';
import { PRODUCT_FILTERS_NAMES } from '@/helpers/constants';

const queryString = require('query-string');

function fetchGroupedProductFields() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          category: 'Лук',
          tags: [
            {
              name: 'Овощи',
              code: 'Овощи',
            },
            {
              name: 'Грусть',
              code: 'Грусть',
            },
          ],
          manufacturers: [
            {
              name: 'Ферма "Веселый кубанец',
              code: 'Ферма "Веселый кубанец',
            },
          ],
          grades: [
            {
              name: 'Краснодарские',
              code: 'Краснодарские',
            },
          ],
          shops: [
            {
              name: 'Народный',
              code: 'Народный',
            },
            {
              name: 'Лимон',
              code: 'Лимон',
            },
          ],
        },
      ]);
    }, 1500);
  });
}

const state = {
  pageName: 'Продукты',
  productsList: [],
  isProductsListLoaded: false,
  fields: {
    categories: [],
    shops: [],
    manufacturers: [],
    grades: [],
    tags: [],
  },
  groupedFields: [],
  initialProduct: {
    userId: '',
    category: '',
    shop: '',
    grade: '',
    manufacturer: '',
    price: 0,
    packingSize: 0,
    unit: '',
    quantity: 0,
    description: '',
    imageUrl: null,
    tags: [],
  },
  metadata: {
    totalItems: 0,
    actualSize: 0,
    actualNumber: 0,
    empty: true,
    offset: 0,
    totalPages: 0,
    first: true,
    last: true,
  },
};

const mutations = {
  setCurrentProduct(state, product) {
    state.initialProduct = product;
  },
  pushNewFilter(state, { filter, value }) {
    state.fields[filter].push(value);
  },
  setFilters(state, fields) {
    state.fields = fields;
  },
  setProductList(state, products) {
    state.productsList = products;
  },
  setProductListLoaded(state, loaded) {
    state.isProductsListLoaded = loaded;
  },
  deleteProduct(state, id) {
    state.productsList = state.productsList.filter((product) => product.id !== id);
  },
  setMetaData(state, metadata) {
    state.metadata = metadata;
  },
  resetInitialProduct(state) {
    state.initialProduct = {
      userId: '',
      category: '',
      shop: '',
      grade: '',
      manufacturer: '',
      price: 0,
      packingSize: 0,
      unit: '',
      quantity: 0,
      description: '',
      imageUrl: null,
      tags: [],
    };
  },
  setGroupedFields(state, fields) {
    state.groupedFields = [];
    fields.forEach((field) => {
      const categoryFilters = Object.keys(field);
      const category = {
        label: field.category,
        key: `filter_category_${field.category}`,
        children: [],
      };
      categoryFilters.forEach((filter) => {
        if (filter !== 'category') {
          const categoryFilter = {
            label: PRODUCT_FILTERS_NAMES[filter],
            key: filter,
            children: [],
          };
          field[filter].forEach((option) => {
            const filterOption = {
              label: option.name,
              key: `filter_${filter}_${option.code}`,
            };

            categoryFilter.children.push(filterOption);
          });
          category.children.push(categoryFilter);
        }
      });
      state.groupedFields.push(category);
    });
  },
};

const actions = {
  async addProduct({ commit }, product) {
    const result = await HTTP.post('/products/add', product);
    commit('setCurrentProduct', result.body);
    eventBus.emit('forceRedirect', `/products/${result.body.id}`);
  },

  async getProduct({ commit }, id) {
    const result = await HTTP.get('/products/getById', { params: { id } });
    commit('setCurrentProduct', result);
  },

  async updateProduct({ commit }, product) {
    const result = await HTTP.put('/products/update', product);
    commit('setCurrentProduct', result.body);
  },

  async getAllProductsFields({ commit }, params) {
    const adaptiveParams = { ...params };
    delete adaptiveParams.page;
    delete adaptiveParams.size;
    const result = await HTTP.get(`/products/getAllProductsFields?${queryString.stringify(adaptiveParams)}`);
    commit('setFilters', result);
  },

  async getProductsFieldsByCategories({ commit }) {
    const result = await fetchGroupedProductFields();
    commit('setGroupedFields', result);
  },

  async getProductsByFilter({ commit }, params) {
    try {
      commit('setProductListLoaded', false);
      const result = await HTTP.get(`/products/getByFilter?${queryString.stringify(params)}`);
      commit('setProductList', result.content);
      commit('setMetaData', result.metadata);
    } finally {
      commit('setProductListLoaded', true);
    }
  },

  async deleteProduct({ commit }, productId) {
    await HTTP.delete('/products/delete', { params: { id: productId } });
    commit('deleteProduct', productId);
  },

  async uploadImage(context, file) {
    const formData = new FormData();
    formData.append('image', file);
    return await HTTP.post('/products/uploadImage', formData);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
