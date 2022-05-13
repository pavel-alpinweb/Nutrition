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
          <h2>menus-pick-product-list</h2>
        </div>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: 'menusPickProductList',
  components: {
    defaultPageLayout,
    InputText,
    Button,
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
}
</style>
