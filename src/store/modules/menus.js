import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';

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
    const result = await HTTP.get('/menus/getById', { params: { id } });
    commit('setInitialMenu', result);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
