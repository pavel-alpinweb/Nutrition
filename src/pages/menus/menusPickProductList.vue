<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="menus-pick-product-list">
        <div class="menus-pick-product-list__header">
          <div class="menus-pick-product-list__wrapper-form p-formgrid">
            <h1>menus-pick-product-list</h1>
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

export default {
  name: 'menusPickProductList',
  components: {
    defaultPageLayout,
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
