<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <div class="dishes-pick-product-list">
        <div class="dishes-pick-product-list__header">
          <div class="dishes-pick-product-list__wrapper-form">
            Form
          </div>
        </div>
        <div class="dishes-pick-product-list__content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
            ccusantium animi blanditiis consequuntur debitis dolore error itaque,
            magni molestias nam nulla numquam omnis pariatur
            provident quas quasi qui quos unde voluptatibus?
          </p>
        </div>
      </div>
    </template>
  </defaultPageLayout>
</template>

<script>
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';

export default {
  name: 'dishesPickPoductList',
  components: {
    defaultPageLayout,
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
  }
</style>
