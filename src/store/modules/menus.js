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
      productCategory: 'string',
      products: [
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: true,
        },
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: false,
        },
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: false,
        },
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: false,
        },
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: false,
        },
        {
          type: 'Menu',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          user: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            name: 'string',
            email: 'string',
          },
          imageUrl: null,
          category: 'string',
          shop: 'string',
          grade: 'string',
          packingSize: 0,
          unit: 'string',
          manufacturer: 'string',
          price: 0,
          quantity: 0,
          necessaryQuantity: 0,
          lackQuantity: 0,
          lackQuantityPrice: 0,
          tags: [
            'string',
          ],
          productIndex: 0,
          checked: false,
        },
      ],
    },
  ],
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
  deleteMenu(state, id) {
    state.menuslist = state.menuslist.filter((menu) => menu.id !== id);
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
