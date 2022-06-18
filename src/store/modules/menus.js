import { HTTP } from '@/modules/api';
import { downloadFile, eventBus } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Меню',
  menuslist: [],
  isMenusListLoaded: true,
  isMenuLoaded: true,
  isPriceLoading: false,
  isGenerateLoading: false,
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
  setPickProductListLoaded(state, loaded) {
    state.isPickProductListLoaded = loaded;
  },
  setIsPriceLoading(state, val) {
    state.isPriceLoading = val;
  },
  setIsGenerateLoading(state, val) {
    state.isGenerateLoading = val;
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
  setMetaData(state, metadata) {
    state.metadata = metadata;
  },
  resetPickProductPage(state) {
    state.lackMenuPrice = 0;
    state.pickProductList = [
      {
        ingredientIndex: 0,
        productCategory: '',
        products: [],
      },
    ];
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
  async generateMenu({ commit }, params) {
    try {
      commit('setIsGenerateLoading', true);
      commit('setIsMenuLoaded', false);
      const result = await HTTP.post('/menus/generate', params);
      commit('setInitialMenu', result.body);
      return true;
    } catch {
      return false;
    } finally {
      commit('setIsGenerateLoading', false);
      commit('setIsMenuLoaded', true);
    }
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
      commit('setMetaData', result.metadata);
    } finally {
      commit('setMenusListLoaded', true);
    }
  },
  async getAllMenuIngredientProducts({ commit }, params) {
    commit('setPickProductListLoaded', false);
    const result = await HTTP.get(`/menus/getAllDishIngredientProducts?${queryString.stringify(params)}`);
    commit('setPickProductsList', result.dishProducts.categories);
    commit('setPickDishesList', result.dishes);
    commit('setPickDishName', result.dishProducts.dishName);
    commit('setPickProductListLoaded', true);
  },
  async deleteMenu({ commit }, menuId) {
    await HTTP.delete('/menus/delete', { params: { id: menuId } });
    commit('deleteMenu', menuId);
  },
  async createReport({ commit }, params) {
    commit('setIsPriceLoading', true);
    const report = await HTTP.post('/menus/createReport', params, {
      responseType: 'blob', // THIS is very important, because we need Blob object in order to download PDF
    });
    downloadFile(report, 'my_report.pdf', 'application/pdf');
    commit('setIsPriceLoading', false);
  },
  async uploadImage(context, file) {
    const formData = new FormData();
    formData.append('image', file);
    const result = await HTTP.post('/menus/uploadImage', formData);
    return result;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
