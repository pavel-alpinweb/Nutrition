<template>
  <Carousel class="pick-product-slider" :value="category.products" :numVisible="3" :numScroll="1">
    <template #header>
      <h2 class="pick-product-slider__title">{{ category.productCategory }}</h2>
    </template>
    <template #item="slotProps">
      <NutritionCard :item="slotProps.data" @checkProductEvent="checkProductHandler" />
    </template>
  </Carousel>
</template>

<script>
import Carousel from 'primevue/carousel';
import NutritionCard from '@/components/NutritionCard.vue';
import { useStore } from 'vuex';

export default {
  name: 'PickProductsSlider',
  components: {
    Carousel,
    NutritionCard,
  },
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const checkProductHandler = (productId) => {
      store.commit('dishes/checkPickProduct', {
        productId,
        categoryId: props.category.ingredientIndex,
      });
    };
    return {
      checkProductHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
  .pick-product-slider {
    &__title {
      text-align: center;
    }
  }
</style>
