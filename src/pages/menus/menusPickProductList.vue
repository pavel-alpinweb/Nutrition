<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="menus-pick-product-list">
        <div class="menus-pick-product-list__header">
          <div class="menus-pick-product-list__wrapper-form p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-4">
                <label for="number">Количество меню</label>
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
              <div class="menus-pick-product-list__btn-container p-field p-col-4">
                <Button
                  label="Рассчитать"
                  icon="fa fa-money"
                  class="p-button-warning"
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
                />
              </div>
            </template>
            <PickProductsSlider
              v-for="category in dishProductList"
              :key="category.ingredientIndex"
              :category="category"
              :circular="true"
            />
          </Panel>
        </div>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import PickProductsSlider from '@/components/PickProductsSlider.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Panel from 'primevue/panel';

export default {
  name: 'menusPickProductList',
  components: {
    defaultPageLayout,
    InputText,
    Button,
    Panel,
    PickProductsSlider,
  },
  setup() {
    const store = useStore();
    const dishProductList = computed(() => store.state.menus.pickProductList);
    const dishNames = computed(() => store.state.menus.pickDishesList);

    return {
      dishNames,
      dishProductList,
    };
  },
};
</script>

<style lang="scss" scoped>
.menus-pick-product-list {
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
  &__dish-btn {
    margin-right: 15px;
  }
}
</style>
