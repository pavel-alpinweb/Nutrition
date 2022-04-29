import { HTTP } from '@/modules/api';
import { eventBus } from '@/modules/utils';
import queryString from 'query-string';

const state = {
  pageName: 'Блюда',
  dishesList: [],
  isDishesListLoaded: true,
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
  dishProductList: [
    {
      ingredientIndex: 0,
      productCategory: 'Сыр',
      products: [
        {
          type: 'Dish',
          id: '1',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '2',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '3',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '4',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '5',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '6',
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
          checked: false,
        },
      ],
    },
    {
      ingredientIndex: 2,
      productCategory: 'Не сыр',
      products: [
        {
          type: 'Dish',
          id: '1',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '2',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '3',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '4',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '5',
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
          checked: false,
        },
        {
          type: 'Dish',
          id: '6',
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
          checked: false,
        },
      ],
    },
  ],
};

const mutations = {
  // eslint-disable-next-line no-shadow
  setDishesListLoaded(state, loaded) {
    state.isDishesListLoaded = loaded;
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
    const category = state.dishProductList.find((cat) => categoryId === cat.ingredientIndex);
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
