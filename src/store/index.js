import { createStore } from 'vuex';
import dishes from '@/store/modules/dishes';
import menus from '@/store/modules/menus';
import products from '@/store/modules/products';
import auth from '@/store/modules/auth';

const store = createStore({
  state() {
    return {
      currentEdit: null,
    };
  },
  mutations: {
    setBadge(state, value) {
      state.currentEdit = value;
    },
  },
  modules: {
    dishes,
    menus,
    products,
    auth,
  },
});

export default store;
