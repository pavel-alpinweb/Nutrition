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
  setLackProductPrice(state, price) {
    state.lackProductPrice = price;
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
