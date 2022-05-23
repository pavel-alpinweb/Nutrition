<template>
  <Carousel
    class="pick-product-slider"
    :value="category.products"
    :circular="true"
    :numVisible="3"
    :numScroll="3"
  >
    <template #header>
      <h2 class="pick-product-slider__title">{{ category.productCategory }}</h2>
    </template>
    <template #item="slotProps">
      <div class="pick-product-slider__item">
        <NutritionCard
          :item="slotProps.data"
          :is-pick-product="true"
          @checkProductEvent="checkProductHandler"
        />
      </div>
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
    sliderType: {
      type: String,
      default: 'dishes',
    },
  },
  setup(props) {
    const store = useStore();
    const checkProductHandler = (productId) => {
      store.commit(`${props.sliderType}/checkPickProduct`, {
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
    &__item {
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
    }
  }
</style>
