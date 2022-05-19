import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Блюда',
  dishesList: [],
  isDishesListLoaded: true,
  isPickProductListLoaded: false,
  lackProductPrice: 0,
  isPriceLoading: false,
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
};

const mutations = {
  // eslint-disable-next-line no-shadow
  setDishesListLoaded(state, loaded) {
    state.isDishesListLoaded = loaded;
  },
  // eslint-disable-next-line no-shadow
  setPickProductListLoaded(state, loaded) {
    state.isPickProductListLoaded = loaded;
  },
  // eslint-disable-next-line no-shadow
  setInitialDish(state, product) {
    state.initialDish = product;
  },
  // eslint-disable-next-line no-shadow
  setFilters(state, filters) {
    state.filters = filters;
  },
  // eslint-disable-next-line no-shadow
  setDishesList(state, dishes) {
    state.dishesList = dishes;
  },
  // eslint-disable-next-line no-shadow
  deleteProduct(state, id) {
    state.dishesList = state.dishesList.filter((dish) => dish.id !== id);
  },
  // eslint-disable-next-line no-shadow
  checkPickProduct(state, { productId, categoryId }) {
    const category = state.pickProductList.find((cat) => categoryId === cat.ingredientIndex);
    category.products.forEach(((item) => {
      if (item.id === productId) {
        // eslint-disable-next-line no-param-reassign
        item.checked = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.checked = false;
      }
    }));
  },
  // eslint-disable-next-line no-shadow
  setPickProductsList(state, productsList) {
    state.pickProductList = productsList;
  },
  // eslint-disable-next-line no-shadow
  setLackProductPrice(state, price) {
    state.lackProductPrice = price;
  },
  // eslint-disable-next-line no-shadow
  setIsPriceLoading(state, val) {
    state.isPriceLoading = val;
  },
  // eslint-disable-next-line no-shadow
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
    const result = await HTTP.get('/dishes/getById', { params: { id } });
    commit('setInitialDish', result);
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
  async getLackProductPrice({ commit }, params) {
    commit('setIsPriceLoading', true);
    const price = await HTTP.post('/dishes/getLackProductPrice', params);
    commit('setLackProductPrice', price);
    commit('setIsPriceLoading', false);
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
