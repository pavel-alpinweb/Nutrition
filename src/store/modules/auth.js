import Cookies from 'js-cookie';
import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';

const state = {
  user: null,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

const getters = {
  hasUser(state) {
    return state.user;
  },
};

const actions = {
  async fetchUser({ commit }) {
    const result = await HTTP.get('/auth/getUserByJws');
    commit('setUser', result);
  },

  async login({ commit }, data) {
    const result = await HTTP.post('/auth/enter', data);
    Cookies.set('nutrition_jws', result.body.jws, { expires: 7 });
    commit('setUser', result.body.user);
    eventBus.emit('forceRedirect', '/');
  },

  async logout({ commit }) {
    await HTTP.post('/auth/logout');
    eventBus.emit('forceRedirect', '/login');
    commit('setUser', null);
    Cookies.remove('nutrition_jws');
  },

  // eslint-disable-next-line
  async verifyEmail(context, data) {
    const url = data.type === 'registration' ? '/auth/verifyEmailForRegistration' : '/auth/verifyEmailForChangeCredentials';
    await HTTP.post(url, { email: data.email });
  },

  async registration({ commit }, data) {
    const url = data.type === 'registration' ? '/auth/registration' : '/auth/changeCredential';
    const result = await HTTP.post(url,
      {
        userName: data.userName,
        userPassword: data.userPassword,
      });
    if (result.body.user) {
      Cookies.remove('nutrition_registration_jws');
      Cookies.set('nutrition_jws', result.body.jws, { expires: 7 });
      commit('setUser', result.body.user);
      eventBus.emit('forceRedirect', '/');
    }
  },

  async changeLoginAndEmail({ commit }, data) {
    if (data.userName === '') {
      // eslint-disable-next-line no-param-reassign
      data.userName = state.user.name;
    }
    if (data.userEmail === '') {
      // eslint-disable-next-line no-param-reassign
      data.userEmail = state.user.email;
    }
    const result = await HTTP.post('/auth/changeLoginAndEmail', data);
    if (result.body) {
      commit('setUser', result.body);
    }
  },

  async changePassword(context, data) {
    await HTTP.post('/auth/changePassword', data);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
