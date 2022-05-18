import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';

const state = {
  pageName: 'Меню',
  menuslist: [
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Новогоднее',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Соялнка', code: 'dishes4' },
      ],
      tags: [
        { name: 'Тэг 1', code: 'markets1' },
        { name: 'Тэг 2', code: 'markets2' },
        { name: 'Красные', code: 'grade1' },
        { name: 'Розовые', code: 'grade2' },
        { name: 'Турецкие', code: 'grade3' },
      ],
    },
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Завтрак 1',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Соялнка', code: 'dishes4' },
      ],
    },
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Обед',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Солянка', code: 'dishes4' },
      ],
    },
  ],
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
    commit('setInitialDish', result.body);
    eventBus.emit('forceRedirect', `/menu/${result.body.id}`);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
