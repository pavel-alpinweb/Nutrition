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
                  id="number"
                  type="number"
                  placeholder="Количество порций"
                  min="1" />
              </div>
              <div class="p-field p-col-4">
                <label for="number">Итоговая стоимость</label>
                <InputText
                  id="price"
                  type="price"
                  placeholder="Итоговая стоимость"
                  min="0"
                  disabled />
              </div>
              <div class="dishes-pick-product-list__btn-container p-field p-col-4">
                <Button
                  label="Рассчитать"
                  icon="fa fa-money"
                  class="p-button-warning"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="dishes-pick-product-list__content">
          <PickProductsSlider
            v-for="category in dishProductList"
            :key="category.ingredientIndex"
            :category="category"
            :circular="true"
          />
        </div>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import PickProductsSlider from '@/components/PickProductsSlider.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'dishesPickPoductList',
  components: {
    defaultPageLayout,
    PickProductsSlider,
    InputText,
    Button,
  },
  setup() {
    const store = useStore();
    const dishProductList = computed(() => store.state.dishes.dishProductList);

    return {
      dishProductList,
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
