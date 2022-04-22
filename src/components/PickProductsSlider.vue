<template>
  <Carousel class="pick-product-slider" :value="productsArray" :numVisible="3" :numScroll="1">
    <template #header>
      <h2 class="pick-product-slider__title">{{ categoryTitle }}</h2>
    </template>
    <template #item="slotProps">
      <NutritionCard :item="slotProps.data" />
    </template>
  </Carousel>
</template>

<script>
import Carousel from 'primevue/carousel';
import NutritionCard from '@/components/NutritionCard.vue';

export default {
  name: 'PickProductsSlider',
  components: {
    Carousel,
    NutritionCard,
  },
  props: {
    productsArray: {
      type: Array,
      default: () => ([]),
    },
    categoryTitle: {
      type: String,
      default: 'Ингридиент',
    },
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
