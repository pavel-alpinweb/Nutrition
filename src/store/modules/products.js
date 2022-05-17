import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';

const queryString = require('query-string');

const state = {
  pageName: 'Продукты',
  productsList: [],
  isProductsListLoaded: false,
  filters: {
    categories: [],
    shops: [],
    manufacturers: [],
    grades: [],
    tags: [],
  },
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
};

const mutations = {
  // eslint-disable-next-line no-shadow
  setCurrentProduct(state, product) {
    state.initialProduct = product;
  },
  // eslint-disable-next-line no-shadow
  pushNewFilter(state, { filter, value }) {
    state.filters[filter].push(value);
  },
  // eslint-disable-next-line no-shadow
  setFilters(state, filters) {
    state.filters = filters;
  },
  // eslint-disable-next-line no-shadow
  setProductList(state, products) {
    state.productsList = products;
  },
  // eslint-disable-next-line no-shadow
  setProductListLoaded(state, loaded) {
    state.isProductsListLoaded = loaded;
  },
  // eslint-disable-next-line no-shadow
  deleteProduct(state, id) {
    state.productsList = state.productsList.filter((product) => product.id !== id);
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

  async getAllProductsFields({ commit }, userId) {
    const result = await HTTP.get('/products/getAllProductsFields', { params: { userId } });
    commit('setFilters', result);
  },

  async getProductsByFilter({ commit }, params) {
    try {
      commit('setProductListLoaded', false);
      const result = await HTTP.get(`/products/getByFilter?${queryString.stringify(params)}`);
      commit('setProductList', result.content);
    } finally {
      commit('setProductListLoaded', true);
    }
  },

  async deleteProduct({ commit }, productId) {
    await HTTP.delete('/products/delete', { params: { id: productId } });
    commit('deleteProduct', productId);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
