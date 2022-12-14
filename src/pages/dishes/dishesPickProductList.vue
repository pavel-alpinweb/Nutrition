<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="dishes-pick-product-list">
        <div class="dishes-pick-product-list__header">
          <div class="dishes-pick-product-list__wrapper-form p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-6">
                <label for="number">Количество порций</label>
                <InputText
                  v-model="dishNumber"
                  id="number"
                  type="number"
                  placeholder="Количество порций"
                  :disabled="isPriceLoading"
                  min="1" />
              </div>
              <div class="dishes-pick-product-list__btn-container p-field p-col-6">
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
        <div v-if="isPickProductListLoaded" class="dishes-pick-product-list__content">
          <PickProductsSlider
            v-for="category in dishProductList"
            :key="category.ingredientIndex"
            :category="category"
            :circular="true"
            slider-type="dishes"
          />
        </div>
        <Skeleton v-else height="400px"/>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import PickProductsSlider from '@/components/PickProductsSlider.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import {
  computed, ref, onMounted, watch, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { eventBus } from '@/modules/utils';

export default {
  name: 'dishesPickProductList',
  components: {
    defaultPageLayout,
    PickProductsSlider,
    InputText,
    Button,
    Skeleton,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const dishNumber = ref(1);
    const dishProductList = computed(() => store.state.dishes.pickProductList);
    const isPickProductListLoaded = computed(() => store.state.dishes.isPickProductListLoaded);
    const isPriceLoading = computed(() => store.state.dishes.isPriceLoading);
    const fetchProductPriceParams = {
      dishId: route.params.id,
      servingNumber: dishNumber.value,
      products: [],
    };

    const fetchPickProductList = async () => {
      await store.dispatch('dishes/getAllIngredientProducts', { dishId: route.params.id, servingNumber: dishNumber.value });
    };
    const fetchReport = async () => {
      fetchProductPriceParams.servingNumber = Number(dishNumber.value);
      await store.dispatch('dishes/createReport', fetchProductPriceParams);
    };
    watch(dishNumber, async () => {
      await fetchPickProductList();
      if (fetchProductPriceParams.products.length) {
        fetchProductPriceParams.products.forEach((product) => {
          store.commit('dishes/checkPickProduct', product);
        });
      }
    });

    onMounted(async () => {
      await fetchPickProductList();
      eventBus.on('checkPickProductEvent', (data) => {
        const oldChoiceIndex = fetchProductPriceParams.products
          .findIndex((choice) => choice.ingredientIndex === data.ingredientIndex);
        if (oldChoiceIndex !== -1) {
          fetchProductPriceParams.products.splice(oldChoiceIndex, 1);
        }
        fetchProductPriceParams.products.push(data);
      });
    });

    onBeforeUnmount(() => {
      store.commit('setBadge', null);
    });

    return {
      dishProductList,
      dishNumber,
      isPickProductListLoaded,
      isPriceLoading,
      fetchPickProductList,
      fetchReport,
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/breakpoints.scss";
  .dishes-pick-product-list {
    padding: 10px;
    &__header {
      display: flex;
      justify-content: center;
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
  }
</style>
