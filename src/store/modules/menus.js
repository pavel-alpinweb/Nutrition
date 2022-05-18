import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Меню',
  menuslist: [],
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
};

const mutations = {
  // eslint-disable-next-line no-shadow
  setFilters(state, filters) {
    state.filters = filters;
  },
  // eslint-disable-next-line no-shadow
  setInitialMenu(state, menu) {
    state.initialMenu = menu;
  },
  // eslint-disable-next-line no-shadow
  setMenusList(state, menus) {
    state.menuslist = menus;
  },
  // eslint-disable-next-line no-shadow
  deleteMenu(state, id) {
    state.menuslist = state.menuslist.filter((menu) => menu.id !== id);
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
    const result = await HTTP.get('/menus/getByName', { params: { id } });
    commit('setInitialMenu', result);
  },
  async getMenuByName({ commit }, name) {
    const result = await HTTP.get('/menus/getByName', { params: { name } });
    commit('setMenusList', [result]);
  },
  async getMenusByFilter({ commit }, params) {
    const result = await HTTP.get(`/menus/getByFilter?${queryString.stringify(params)}`);
    commit('setMenusList', result.content);
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
