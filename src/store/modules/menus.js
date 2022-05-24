import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Меню',
  menuslist: [],
  isMenusListLoaded: true,
  isMenuLoaded: true,
  filters: {
    menuNames: [],
    menuTags: [],
    dishNames: [],
  },
  initialMenu: {
    name: '',
    imageUrl: null,
    description: '',
    items: [],
    tags: [],
  },
  pickProductList: [
    {
      ingredientIndex: 0,
      productCategory: '',
      products: [],
    },
  ],
  pickDishesList: [],
  pickDishName: null,
};

const mutations = {
  setMenusListLoaded(state, loaded) {
    state.isMenusListLoaded = loaded;
  },
  setIsMenuLoaded(state, loaded) {
    state.isMenuLoaded = loaded;
  },
  setFilters(state, filters) {
    state.filters = filters;
  },
  setInitialMenu(state, menu) {
    state.initialMenu = menu;
  },
  setMenusList(state, menus) {
    state.menuslist = menus;
  },
  setPickProductsList(state, productsList) {
    state.pickProductList = productsList;
  },
  setPickDishesList(state, dishesList) {
    state.pickDishesList = dishesList;
  },
  setPickDishName(state, dishName) {
    state.pickDishName = dishName;
  },
  deleteMenu(state, id) {
    state.menuslist = state.menuslist.filter((menu) => menu.id !== id);
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
  resetInitialMenu(state) {
    state.initialMenu = {
      name: '',
      imageUrl: null,
      description: '',
      items: [],
      tags: [],
    };
  },
};

const actions = {
  async getAllMenusFields({ commit }) {
    const result = await HTTP.get('/menus/getAllMenusFields');
    commit('setFilters', result);
  },
  async menuAdd({ commit }, menu) {
    const result = await HTTP.post('/menus/add', menu);
    commit('setInitialMenu', result.body);
    eventBus.emit('forceRedirect', `/menu/${result.body.id}`);
  },
  async updateMenu({ commit }, menu) {
    const result = await HTTP.put('/menus/update', menu);
    commit('setInitialMenu', result.body);
  },
  async getMenuById({ commit }, id) {
    try {
      commit('setIsMenuLoaded', false);
      const result = await HTTP.get('/menus/getById', { params: { id } });
      commit('setInitialMenu', result);
    } finally {
      commit('setIsMenuLoaded', true);
    }
  },
  async getMenuByName({ commit }, name) {
    try {
      commit('setMenusListLoaded', false);
      const result = await HTTP.get('/menus/getByName', { params: { name } });
      commit('setMenusList', [result]);
    } finally {
      commit('setMenusListLoaded', true);
    }
    const result = await HTTP.get('/menus/getByName', { params: { name } });
    commit('setMenusList', [result]);
  },
  async getMenusByFilter({ commit }, params) {
    try {
      commit('setMenusListLoaded', false);
      const result = await HTTP.get(`/menus/getByFilter?${queryString.stringify(params)}`);
      commit('setMenusList', result.content);
    } finally {
      commit('setMenusListLoaded', true);
    }
  },
  async getAllMenuIngredientProducts({ commit }, params) {
    const result = await HTTP.get(`/menus/getAllDishIngredientProducts?${queryString.stringify(params)}`);
    commit('setPickProductsList', result.dishProducts.categories);
    commit('setPickDishesList', result.dishes);
    commit('setPickDishName', result.dishProducts.dishName);
  },
  async deleteMenu({ commit }, menuId) {
    await HTTP.delete('/menus/delete', { params: { id: menuId } });
    commit('deleteMenu', menuId);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
