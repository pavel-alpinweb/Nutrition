<template>
  <Card class="nutrition-card">
    <template #header>
      <div class="nutrition-card__header">
        <Button
          icon="fas fa-pen"
          class="nutrition-card__btn p-button-rounded p-button-warning"
          @click="openItem(item.type, item.id)"
        />
        <Button
          icon="fas fa-trash"
          class="nutrition-card__btn p-button-rounded p-button-warning"
          @click="openDeleteProductConfirm(item.id)"
        />
      </div>
    </template>
    <template #title>
      <Image
        v-if="item.imageUrl"
        class="nutrition-card__image"
        width="150"
        :src="item.imageUrl"
        alt="Image Text"
        preview
      />
      <div v-else-if="item.type === 'Product'" class="nutrition-card__default-image">
        <i class="fas fa-carrot"></i>
      </div>
      <div v-else-if="item.type === 'Dish'" class="nutrition-card__default-image">
        <i class="fas fa-concierge-bell"></i>
      </div>
      <div v-else-if="item.type === 'Menu'" class="nutrition-card__default-image">
        <i class="fas fa-utensils"></i>
      </div>
    </template>
    <template #content>
      <ul class="nutrition-card__characters">
        <li class="nutrition-card__char">
          <i class="fas fa-tag nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.category || item.name }}</div>
        </li>
        <li v-if="item.shop" class="nutrition-card__char">
          <i class="fas fa-store nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.shop }}</div>
        </li>
        <li v-if="item.grade" class="nutrition-card__char">
          <i class="fas fa-certificate nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.grade }}</div>
        </li>
        <li v-if="item.price" class="nutrition-card__char">
          <i class="fas fa-dollar-sign nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.price }}</div>
        </li>
        <li v-if="item.averagePrice" class="nutrition-card__char">
          <i class="fas fa-dollar-sign nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.averagePrice }}(Средняя цена)</div>
        </li>
        <li v-if="item.manufacturer" class="nutrition-card__char">
          <i class="fa fa-industry nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">{{ item.manufacturer }}</div>
        </li>
        <li v-if="item.quantity !== undefined" class="nutrition-card__char">
          <i class="fas fa-home nutrition-card__char-icon"></i>
          <div class="nutrition-card__char-value">
            {{ item.quantity }} {{ item.unit }}(в наличии)
          </div>
        </li>
      </ul>
    </template>
    <template #footer>
      <div
        v-if="item.products?.length > 0"
        class="nutrition-card__footer"
      >
        <Tag
          v-for="tag in item.products"
          :key="tag.code"
          class="p-mr-2 p-mb-2"
          severity="success"
          :value="tag.name"
          icon="fas fa-carrot"
          rounded>
        </Tag>
      </div>
      <div
        v-if="item.dishes?.length > 0"
        class="nutrition-card__footer"
      >
        <Tag
          v-for="tag in item.dishes"
          :key="tag.code"
          class="p-mr-2 p-mb-2"
          severity="info"
          :value="tag.name"
          size="large"
          icon="fas fa-concierge-bell"
          rounded>
        </Tag>
      </div>
      <div
        v-if="item.tags?.length > 0"
        class="nutrition-card__footer"
      >
        <Tag
          v-for="tag in item.tags"
          :key="tag"
          class="p-mr-2 p-mb-2"
          severity="warning"
          :value="tag"
          rounded>
        </Tag>
      </div>

      <div v-if="isPickProduct" class="pick-info">
        <Splitter class="p-mb-2 pick-info__container p-p-2">
          <SplitterPanel
            class="pick-info__item flex
            align-items-center
            justify-content-center
            p-text-center
            p-text-bold"
          >
            Необходимое кол-во
          </SplitterPanel>
          <SplitterPanel class="flex align-items-center justify-content-center p-text-center">
            {{ item.necessaryQuantity }}
          </SplitterPanel>
        </Splitter>
        <Splitter class="p-mb-2 pick-info__container p-p-2">
          <SplitterPanel
            class="pick-info__item
            flex align-items-center
            justify-content-center
            p-text-center
            p-text-bold"
          >
            Необходимо докупить
          </SplitterPanel>
          <SplitterPanel class="flex align-items-center justify-content-center p-text-center">
            {{ item.lackQuantity }}
          </SplitterPanel>
        </Splitter>
        <Splitter class="p-mb-2 pick-info__container p-p-2">
          <SplitterPanel
            class="pick-info__item
            flex
            align-items-center
            justify-content-center
            p-text-center
            p-text-bold"
          >
            Стоимость докупаемого
          </SplitterPanel>
          <SplitterPanel class="flex align-items-center justify-content-center p-text-center">
            {{ item.lackQuantityPrice }}
          </SplitterPanel>
        </Splitter>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import Tag from 'primevue/tag';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'NutritionCard',
  components: {
    Card,
    Button,
    Image,
    Tag,
    Splitter,
    SplitterPanel,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const confirm = useConfirm();
    const toast = useToast();
    const store = useStore();
    // eslint-disable-next-line no-prototype-builtins
    const isPickProduct = computed(() => props.item.hasOwnProperty('necessaryQuantity')
      // eslint-disable-next-line no-prototype-builtins
      && props.item.hasOwnProperty('lackQuantityPrice')
      // eslint-disable-next-line no-prototype-builtins
      && props.item.hasOwnProperty('lackQuantity'));

    const openItem = (type, itemId) => {
      let section = '';
      switch (type) {
        case 'Product': section = 'products';
          break;
        case 'Dish': section = 'dishes';
          break;
        case 'menu': section = 'menu';
          break;
        default:
          break;
      }

      router.push(`/${section}/${itemId}`);
    };
    const openDeleteProductConfirm = (id) => {
      confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          switch (props.item.type) {
            case 'Product': await store.dispatch('products/deleteProduct', id);
              break;
            case 'Dish': await store.dispatch('dishes/deleteProduct', id);
              break;
            case 'menu': await store.dispatch('products/deleteProduct', id);
              break;
            default:
              break;
          }
        },
        reject: () => {
          toast.add({
            severity: 'info', summary: 'Отмена', detail: 'Вы отменили удаление', life: 3000,
          });
        },
      });
    };
    return {
      openItem,
      openDeleteProductConfirm,
      isPickProduct,
    };
  },
};
</script>

<style lang="scss" scoped>
.nutrition-card {
  &__header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }

  &__footer {
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
  }

  &__btn {
    margin-left: 5px;
    color: #fff;
  }

  &__default-image {
    font-size: 100px;
    text-align: center;
  }

  &__image {
    display: flex;
    justify-content: center;
  }
  &__characters {
    padding-left: 0;
    margin: -10px 0;
  }
  &__char {
    list-style: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
  }
  &__char-icon {
    margin-right: 10px;
    font-size: 20px;
    width: 25px;
    text-align: center;
  }
}
.pick-info {
  &__item {
    font-size: 12px;
  }
}
</style>
