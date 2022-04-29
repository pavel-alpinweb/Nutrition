<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="dishes-edit">
        <div class="dishes-edit-header p-grid">
          <div class="dishes-edit-header__left p-col-6">
            <FileUpload
              name="demo[]"
              url="./upload.php"
              @upload="onUpload"
              :multiple="false"
              accept="image/*"
              :maxFileSize="1000000"
            >
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
            <Image
              v-if="image"
              class="product-edit__image"
              width="250"
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              alt="Image"
            />
            <div v-else class="dishes-edit__default-image">
              <i class="fas fa-concierge-bell"></i>
            </div>
          </div>
          <div class="dishes-edit-header__right p-col-6 p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-12">
                <label for="name">Название блюда</label>
                <InputText
                  v-model="dish.name"
                  id="name"
                  type="text"
                  placeholder="Название блюда"
                  min="0"
                />
              </div>
              <div class="p-field p-col-4">
                <label for="size">Размер порции</label>
                <InputText
                  v-model="dish.servingSize"
                  id="size"
                  type="number"
                  placeholder="Размер"
                  min="0"
                />
              </div>
              <div class="p-field p-col-8">
                <label for="options">Единицы</label>
                <Dropdown
                  v-model="unitOptions.selectedOption.value"
                  inputId="options"
                  :options="unitOptions.options.value"
                  optionLabel="name"
                  placeholder="Единицы"
                  @change="unitChangeHandler"
                />
              </div>
              <div class="p-field p-col-12">
                <label for="describe">Примечание</label>
                <Textarea
                  v-model="dish.description"
                  id="describe"
                  :autoResize="true"
                  rows="5"
                  cols="30"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="dishes-edit-content">
          <Panel header="Ингридиенты">
            <template #icons>
              <Button
                label="Добавить"
                icon="fas fa-plus-circle"
                class="p-button-success"
                @click="createIngredient()"
              />
              <Button
                label="Подобрать продукты"
                icon="fas fa-carrot"
                class="p-button-warning"
                @click="pushToPickList()"
              />
            </template>
            <div class="p-grid">
              <div class="p-col-8 p-text-center">
                <h2>Ингридиент</h2>
              </div>
              <div class="p-col-4 p-text-center">
                <h2>Количество</h2>
              </div>
            </div>
            <Ingredient
              v-for="item in dish.ingredients"
              :key="item.id"
              :item="item"
              @deleteIngredient="deleteIngredientHandler"
              @inputServingSize="inputServingSizeHandler"
              @changeOption="changeOptionHandler"
            />
          </Panel>
        </div>
        <div class="dishes-edit-footer">
          <div class="p-fluid p-field">
            <label for="tags">Тэги</label>
            <Chips id="tags" v-model="dish.tags"/>
          </div>
          <div class="dishes-edit-footer__buttons">
            <Button
              v-if="!isNewDish"
              label="Новое блюдо"
              icon="fas fa-plus-circle"
              class="p-button-success"
              @click="addDish"
            />
            <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="save"/>
            <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning" @click="reset"/>
          </div>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed, reactive, onMounted, watch, ref, onBeforeUnmount,
} from 'vue';
import useUpload from '@/composition/upload';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import Panel from 'primevue/panel';
import Chips from 'primevue/chips';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import useOptions from '@/composition/selectOptions';
import Ingredient from '@/components/Ingredient.vue';
import { GLOBAL_UNITS } from '@/modules/constants';
import IngredientTemplate from '@/modules/classes';
import { useRoute, useRouter } from 'vue-router';
import useSetSelect from '@/composition/setSelect';

export default {
  name: 'dishesEditPage',
  components: {
    DefaultPageLayout,
    Panel,
    Chips,
    Button,
    FileUpload,
    InputText,
    Dropdown,
    Textarea,
    Ingredient,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const image = reactive();
    const dish = reactive({});
    const ingredientsArr = ref([]);
    const initialDish = computed(() => store.state.dishes.initialDish);
    const isNewDish = computed(() => route.params.id === 'new');
    const unitOptions = useOptions(GLOBAL_UNITS);
    const user = computed(() => store.state.auth.user);

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
        useSetSelect(unitOptions, initialDish, 'unit');
      }
    });

    onMounted(async () => {
      if (!isNewDish.value) {
        await store.dispatch('dishes/getDishById', route.params.id);
      }
      if (user.value) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
      }
      ingredientsArr.value = initialDish.value.ingredients;
      Object.assign(dish, initialDish.value);
      store.commit('setBadge', dish.name);
    });

    onBeforeUnmount(() => {
      store.commit('setBadge', null);
    });

    const reset = () => {
      window.location.replace(`/dishes/${route.params.id}`);
    };

    const deleteIngredientHandler = (index) => {
      dish.ingredients = dish.ingredients.filter(
        (ing) => ing.index !== index,
      );
    };

    const inputServingSizeHandler = (data) => {
      const ingredient = dish.ingredients.find((ing) => ing.index === data.index);
      ingredient.quantity = data.quantity;
    };

    const createIngredient = () => {
      const index = dish.ingredients.length;
      const ingrid = new IngredientTemplate(index);
      ingredientsArr.value.push(ingrid);
      dish.ingredients = ingredientsArr;
    };

    const changeOptionHandler = (data) => {
      const ingredient = dish.ingredients.find((ing) => ing.index === data.index);
      if (data.field === 'category') {
        ingredient.filter.category = data.value;
      } else {
        const optionArr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const option of data.value) {
          optionArr.push(option.name);
        }
        ingredient.filter[data.field] = optionArr;
      }
    };

    const unitChangeHandler = (event) => {
      dish.unit = event.value.name;
    };

    const addDish = () => {
      window.location.replace('/dishes/new');
    };

    const pushToPickList = () => {
      router.push('/dishes-pick-product-list');
    };

    const save = async () => {
      if (isNewDish.value) {
        await store.dispatch('dishes/dishAdd', dish);
      } else {
        await store.dispatch('dishes/updateDish', dish);
      }
    };

    return {
      ...useUpload(),
      image,
      unitOptions,
      initialDish,
      isNewDish,
      dish,
      reset,
      save,
      addDish,
      createIngredient,
      deleteIngredientHandler,
      inputServingSizeHandler,
      changeOptionHandler,
      unitChangeHandler,
      pushToPickList,
      ingredientsArr,
    };
  },
};
</script>

<style lang="scss" scoped>
  .test {
    grid-template-areas:
      'title widget'
    'text widget'
  'slider widget';
  }
  .dishes-edit {
    padding: 10px;
    &-footer {
      padding: 10px;
    }
    .p-button {
      margin-right: .5rem;
    }
    &__default-image {
      font-size: 300px;
      text-align: center;
      margin-top: 20px;
      color: grey;
    }
  }

</style>
