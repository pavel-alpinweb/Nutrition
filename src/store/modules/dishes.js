import { HTTP } from '@/modules/api';
import { eventBus, downloadFile } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Блюда',
  dishesList: [],
  isDishesListLoaded: true,
  isPickProductListLoaded: false,
  isPriceLoading: false,
  isDishLoaded: true,
  filters: {
    dishTags: [],
    dishUnits: [],
    dishNames: [],
    productCategories: [],
  },
  initialDish: {
    user: null,
    name: '',
    servingSize: 0,
    unit: '',
    description: '',
    imageUrl: null,
    ingredients: [],
    tags: [],
  },
  pickProductList: [],
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
  setDishesListLoaded(state, loaded) {
    state.isDishesListLoaded = loaded;
  },
  setPickProductListLoaded(state, loaded) {
    state.isPickProductListLoaded = loaded;
  },
  setInitialDish(state, product) {
    state.initialDish = product;
  },
  setFilters(state, filters) {
    state.filters = filters;
  },
  setDishesList(state, dishes) {
    state.dishesList = dishes;
  },
  deleteProduct(state, id) {
    state.dishesList = state.dishesList.filter((dish) => dish.id !== id);
  },
  setMetaData(state, metadata) {
    state.metadata = metadata;
  },
  checkPickProduct(state, { productIndex, ingredientIndex }) {
    const category = state.pickProductList.find((cat) => ingredientIndex === cat.ingredientIndex);
    category.products.forEach(((item) => {
      if (item.productIndex === productIndex) {
        // eslint-disable-next-line no-param-reassign
        item.checked = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.checked = false;
      }
    }));
  },
  setPickProductsList(state, productsList) {
    state.pickProductList = productsList;
  },
  setIsPriceLoading(state, val) {
    state.isPriceLoading = val;
  },
  setIsDishLoaded(state, val) {
    state.isDishLoaded = val;
  },
  resetInitialDish(state) {
    state.initialDish = {
      user: null,
      name: '',
      servingSize: 0,
      unit: '',
      description: '',
      imageUrl: null,
      ingredients: [],
      tags: [],
    };
  },
};

const actions = {
  async dishAdd({ commit }, dish) {
    const result = await HTTP.post('/dishes/add', dish);
    commit('setInitialDish', result.body);
    eventBus.emit('forceRedirect', `/dishes/${result.body.id}`);
  },
  async getDishById({ commit }, id) {
    try {
      commit('setIsDishLoaded', false);
      const result = await HTTP.get('/dishes/getById', { params: { id } });
      commit('setInitialDish', result);
    } finally {
      commit('setIsDishLoaded', true);
    }
  },
  async getDishByName({ commit }, name) {
    const result = await HTTP.get('/dishes/getByName', { params: { name } });
    commit('setDishesList', [result]);
  },
  async updateDish({ commit }, dish) {
    const result = await HTTP.put('/dishes/update', dish);
    commit('setInitialDish', result.body);
  },
  async getAllDishesFields({ commit }) {
    const result = await HTTP.get('/dishes/getAllDishesFields');
    commit('setFilters', result);
  },
  async getDishesByFilter({ commit }, params) {
    try {
      commit('setDishesListLoaded', false);
      const result = await HTTP.get(`/dishes/getByFilter?${queryString.stringify(params)}`);
      commit('setDishesList', result.content);
      commit('setMetaData', result.metadata);
    } finally {
      commit('setDishesListLoaded', true);
    }
  },
  async deleteProduct({ commit }, productId) {
    await HTTP.delete('/dishes/delete', { params: { id: productId } });
    commit('deleteProduct', productId);
  },
  async getAllIngredientProducts({ commit }, params) {
    commit('setPickProductListLoaded', false);
    const result = await HTTP.get(`/dishes/getAllIngredientProducts?${queryString.stringify(params)}`);
    commit('setPickProductsList', result.categories);
    commit('setPickProductListLoaded', true);
  },
  async createReport({ commit }, params) {
    commit('setIsPriceLoading', true);
    const report = await HTTP.post('/dishes/createReport', params, {
      responseType: 'blob', // THIS is very important, because we need Blob object in order to download PDF
    });
    downloadFile(report, 'my_report.pdf', 'application/pdf');
    commit('setIsPriceLoading', false);
  },
  async uploadImage(context, file) {
    const formData = new FormData();
    formData.append('image', file);
    const result = await HTTP.post('/dishes/uploadImage', formData);
    return result;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
