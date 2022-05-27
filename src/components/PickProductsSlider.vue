<template>
  <div class="pick-product-slider">
    <h2 class="pick-product-slider__title">{{ category.productCategory }}</h2>
    <div class="pick-product-slider__content">
      <ScrollPanel style="width: 100%; height: 700px" class="custombar1">
        <div class="pick-product-slider__content">
          <div
            v-for="item in category.products"
            :key="item.id"
            class="pick-product-slider__item"
          >
            <NutritionCard
              :item="item"
              :is-pick-product="true"
              @checkProductEvent="checkProductHandler"
            />
          </div>
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>

<script>
import NutritionCard from '@/components/NutritionCard.vue';
import ScrollPanel from 'primevue/scrollpanel';
import { useStore } from 'vuex';
import { eventBus } from '@/modules/utils';

export default {
  name: 'PickProductsSlider',
  components: {
    NutritionCard,
    ScrollPanel,
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
    const checkProductHandler = (productIndex) => {
      store.commit(`${props.sliderType}/checkPickProduct`, {
        productIndex,
        ingredientIndex: props.category.ingredientIndex,
      });
      eventBus.emit('checkPickProductEvent', {
        productIndex,
        ingredientIndex: props.category.ingredientIndex,
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
    &__content {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
    }
    &__item {
      min-width: 300px;
      flex-basis: 300px;
      margin: 0 15px;
      display: flex;
      justify-content: center;
    }
  }
  ::v-deep(.p-scrollpanel) {
    &.custombar1 {
      .p-scrollpanel-bar {
        background-color: #FFBA01;
        opacity: 1;
        transition: background-color .2s;

        &:hover {
          background-color: #FFBA01;
        }
      }
    }
  }
</style>
