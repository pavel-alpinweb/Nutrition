<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="dishes-pick-product-list">
        <div class="dishes-pick-product-list__header">
          <div class="dishes-pick-product-list__wrapper-form p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-4">
                <label for="number">Количество порций</label>
                <InputText
                  v-model="dishNumber"
                  id="number"
                  type="number"
                  placeholder="Количество порций"
                  min="1" />
              </div>
              <div class="p-field p-col-4">
                <label for="number">Итоговая стоимость</label>
                <span class="p-input-icon-right">
                  <i v-if="isPriceLoading" class="pi pi-spin pi-spinner" />
                  <InputText
                    v-model="lackProductPrice"
                    id="price"
                    type="price"
                    placeholder="Итоговая стоимость"
                    min="0"
                    :disabled="isPriceLoading"
                    readonly />
                </span>
              </div>
              <div class="dishes-pick-product-list__btn-container p-field p-col-4">
                <Button
                  label="Рассчитать"
                  icon="fa fa-money"
                  class="p-button-warning"
                  :disabled="isPriceLoading"
                  @click="fetchLackProductPrice"
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
          />
        </div>
        <Skeleton v-if="!isPickProductListLoaded" height="400px"/>
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
  computed, ref, onMounted, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

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
    const lackProductPrice = computed(() => store.state.dishes.lackProductPrice);
    const isPriceLoading = computed(() => store.state.dishes.isPriceLoading);

    const fetchPickProductList = async () => {
      await store.dispatch('dishes/getAllIngredientProducts', { dishId: route.params.id, servingNumber: dishNumber.value });
    };
    const fetchLackProductPrice = () => {
      const fetchProductPriceParams = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const ingredient of dishProductList.value) {
        const product = ingredient.products.find((item) => item.checked);
        const ingredientData = {
          ingredientIndex: ingredient.ingredientIndex,
          productIndex: product.id,
        };
        fetchProductPriceParams.push(ingredientData);
      }
      console.log('fetchProductPriceParams', fetchProductPriceParams);
    };
    watch(dishNumber, async () => {
      await fetchPickProductList();
    });

    onMounted(async () => {
      await fetchPickProductList();
    });

    return {
      dishProductList,
      dishNumber,
      isPickProductListLoaded,
      lackProductPrice,
      isPriceLoading,
      fetchPickProductList,
      fetchLackProductPrice,
    };
  },
};
</script>

<style lang="scss" scoped>
  .dishes-pick-product-list {
    padding: 10px;
    &__header {
      display: flex;
      justify-content: flex-end;
    }
    &__wrapper-form {
      flex-basis: 50%;
    }
    &__btn-container {
      display: flex;
      align-items: flex-end;
    }
  }
</style>
