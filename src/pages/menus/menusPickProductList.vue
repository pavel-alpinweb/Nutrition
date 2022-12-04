<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="menus-pick-product-list">
        <div class="menus-pick-product-list__header">
          <div class="menus-pick-product-list__wrapper-form p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-6">
                <label for="number">Количество меню</label>
                <InputText
                  v-model="menuQuantity"
                  id="number"
                  type="number"
                  placeholder="Количество порций"
                  :disabled="isPriceLoading"
                  min="1" />
              </div>
              <div class="p-field menus-pick-product-list__btn-container p-col-6">
                <Button
                  label="Составить отчет"
                  icon="fas fa-print"
                  class="p-button-warning"
                  :disabled="isPriceLoading"
                  @click="fetchReport"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="menus-pick-product-list__content">
          <Panel>
            <template #header>
              <div class="menus-pick-product-list__dish-names">
                <Button
                  v-for="dish in dishNames"
                  :key="dish.id"
                  :label="dish.dishName"
                  icon="fas fa-concierge-bell"
                  class="menus-pick-product-list__dish-btn p-button-warning"
                  :class="{'p-button-outlined' : dish.dishName !== currentDishName}"
                  @click="fetchPickProductList(dish.dishName)"
                />
              </div>
            </template>
            <div v-if="isPickProductListLoaded" class="menus-pick-product-list__container">
              <PickProductsSlider
                v-for="category in dishProductList"
                :key="category.ingredientIndex"
                :category="category"
                :circular="true"
                slider-type="menus"
              />
            </div>
            <Skeleton v-else height="400px"/>
          </Panel>
        </div>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import {
  computed, onMounted, ref, watch, reactive, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import PickProductsSlider from '@/components/PickProductsSlider.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Panel from 'primevue/panel';
import Skeleton from 'primevue/skeleton';
import { useRoute } from 'vue-router';
import { eventBus } from '@/modules/utils';

export default {
  name: 'menusPickProductList',
  components: {
    defaultPageLayout,
    InputText,
    Button,
    Panel,
    Skeleton,
    PickProductsSlider,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const menuQuantity = ref(1);
    const dishProductList = computed(() => store.state.menus.pickProductList);
    const dishNames = computed(() => store.state.menus.pickDishesList);
    const currentDishName = computed(() => store.state.menus.pickDishName);
    const lackMenuPrice = computed(() => store.state.menus.lackMenuPrice);
    const isPriceLoading = computed(() => store.state.menus.isPriceLoading);
    const isPickProductListLoaded = computed(() => store.state.menus.isPickProductListLoaded);
    const pickMenuParams = reactive({
      menuId: route.params.id,
      menuNumber: menuQuantity.value,
      products: [],
    });

    const fetchPickProductList = async (dishName) => {
      const params = { menuId: route.params.id, menuQuantity: menuQuantity.value };
      if (dishName) {
        params.dishName = dishName;
      }
      await store.dispatch('menus/getAllMenuIngredientProducts', params);
      if (pickMenuParams.products.length) {
        pickMenuParams.products.forEach((product) => {
          if (product.dishName === currentDishName.value) {
            store.commit('menus/checkPickProduct', product);
          }
        });
      }
    };

    const fetchReport = async () => {
      pickMenuParams.menuNumber = Number(menuQuantity.value);
      await store.dispatch('menus/createReport', pickMenuParams);
    };
    watch(menuQuantity, async () => {
      await fetchPickProductList(currentDishName.value);
    });

    onMounted(async () => {
      await fetchPickProductList(null);
      eventBus.on('checkPickProductEvent', (data) => {
        const oldChoiceIndex = pickMenuParams.products
          .findIndex((choice) => choice.ingredientIndex === data.ingredientIndex
          && choice.dishName === currentDishName.value);
        if (oldChoiceIndex !== -1) {
          pickMenuParams.products.splice(oldChoiceIndex, 1);
        }
        pickMenuParams.products.push({
          dishName: currentDishName.value,
          productIndex: data.productIndex,
          ingredientIndex: data.ingredientIndex,
        });
      });
    });

    onBeforeUnmount(() => {
      store.commit('menus/resetPickProductPage');
      store.commit('setBadge', null);
    });

    return {
      dishNames,
      dishProductList,
      currentDishName,
      menuQuantity,
      lackMenuPrice,
      isPriceLoading,
      isPickProductListLoaded,
      fetchPickProductList,
      fetchReport,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/breakpoints.scss";
.menus-pick-product-list {
  padding: 10px;
  &__header {
    display: flex;
    justify-content: flex-end;
  }
  &__wrapper-form {
    flex-basis: 50%;
    @include all-big-mobiles {
      flex-basis: 100%;
    }
  }
  &__btn-container {
    display: flex;
    align-items: flex-end;
  }
  &__dish-btn {
    margin-right: 15px;
  }
}
</style>
