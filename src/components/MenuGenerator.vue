<template>
  <Dialog
    header="Генератор меню"
    v-model:visible="showMenuGenerator"
    :style="{width: '50vw'}"
    :modal="true"
    :draggable="false"
    :dismissableMask="false"
  >
    <div class="menu-generator">
      <div class="menu-generator__content">
        <div class="menu-generator__section">
          <div class="p-fluid p-field">
            <label for="name">Название меню</label>
            <InputText
              v-model="generatorParams.menuName"
              id="name"
              type="text"
              placeholder="Название"
            />
          </div>
          <div class="p-fluid p-field">
            <label for="cost">Максимальное допустимая стоимость меню</label>
            <InputText
              v-model="generatorParams.maxPrice"
              id="cost"
              type="number"
              placeholder="Стоимость"
              min="1"
            />
          </div>
          <div class="p-grid p-align-end">
            <div class="p-col-6">
              <div class="p-fluid p-field">
                <label for="minMealsNumber">Минимальное кол-во приемов пищи на человека</label>
                <InputText
                  v-model="generatorParams.minMealsNumber"
                  id="minMealsNumber"
                  type="number"
                  placeholder="Стоимость"
                  min="1"
                />
              </div>
            </div>
            <div class="p-col-6">
              <div class="p-fluid p-field">
                <label for="minMealsNumber">Кол-во порций блюд в одном приеме пищи</label>
                <InputText
                  v-model="generatorParams.servingNumberPerMeal"
                  id="servingNumberPerMeal"
                  type="number"
                  placeholder="Стоимость"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="menu-generator__section">
          <label class="menu-generator__title">
            <span>Ограничения по продуктам</span>
            <Button
              icon="fas fa-plus-circle"
              class="nutrition-card__btn p-button-rounded p-button-warning"
              @click="createNewProductsParam"
            />
          </label>
          <div class="p-formgrid">
            <div
              v-for="(product, key) in generatorParams.productConstraints"
              :key="key"
              class="p-fluid p-grid"
            >
              <div class="p-field p-col-6">
                <Dropdown
                  v-model="product.productCategory"
                  :options="productOptions.options.value"
                  option-value="name"
                  optionLabel="name"
                  placeholder="Категоия продукта"
                />
              </div>
              <div class="p-field p-col-3">
                <Dropdown
                  v-model="product.condition"
                  :options="conditionsOptions.options.value"
                  option-value="code"
                  optionLabel="name"
                  placeholder="Не менее"
                />
              </div>
              <div class="p-field p-col-2">
                <InputText
                  v-model="product.quantity"
                  type="number"
                  placeholder="Кол-во"
                  min="1"
                />
              </div>
              <div class="p-field p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="nutrition-card__btn p-button-rounded p-button-warning"
                  @click="deleteProductsParam(key)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="menu-generator__section">
          <label class="menu-generator__title">
            <span>Ограничения по блюдам</span>
            <Button
              icon="fas fa-plus-circle"
              class="nutrition-card__btn p-button-rounded p-button-warning"
              @click="createNewDishesParam"
            />
          </label>
          <div class="p-formgrid">
            <div
              v-for="(dish, key) in generatorParams.dishTagConstraints"
              :key="key"
              class="p-fluid p-grid"
            >
              <div class="p-field p-col-6">
                <Dropdown
                  v-model="dish.dishTag"
                  :options="tagsOptions.options.value"
                  option-value="code"
                  optionLabel="name"
                  placeholder="Тэги блюда"
                />
              </div>
              <div class="p-field p-col-3">
                <Dropdown
                  v-model="dish.condition"
                  :options="conditionsOptions.options.value"
                  option-value="code"
                  optionLabel="name"
                  placeholder="Не менее"
                />
              </div>
              <div class="p-field p-col-2">
                <InputText
                  v-model="dish.quantity"
                  type="number"
                  placeholder="Кол-во"
                  min="1"
                />
              </div>
              <div class="p-field p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="nutrition-card__btn p-button-rounded p-button-warning"
                  @click="deleteDishesParam(key)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-generator__footer">
        <Button
          label="Подобрать"
          class="p-button-success"
          :disabled="isGenerateLoading"
          @click="generate"
        />
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import {
  reactive, ref, onMounted, computed,
} from 'vue';
import { eventBus } from '@/modules/utils';
import { useStore } from 'vuex';
import useOptions from '@/composition/selectOptions';
import { CONDITIONS } from '@/modules/constants';

export default {
  name: 'MenuGenerator',
  components: {
    Dialog,
    Button,
    InputText,
    Dropdown,
  },
  setup(props, { emit }) {
    const store = useStore();
    const filters = computed(() => store.state.dishes.filters);
    const dishTags = computed(() => store.state.dishes.filters.dishTags);
    const isGenerateLoading = computed(() => store.state.menus.isGenerateLoading);
    const productCategories = computed(() => store.state.dishes.filters.productCategories);
    const tagsOptions = useOptions(dishTags);
    const productOptions = useOptions(productCategories);
    const conditionsOptions = useOptions(CONDITIONS);
    const showMenuGenerator = ref(false);
    const generatorParams = reactive({
      menuName: '',
      maxPrice: 1,
      minMealsNumber: 1,
      servingNumberPerMeal: 1,
      productConstraints: [],
      dishTagConstraints: [],
    });

    onMounted(async () => {
      await store.dispatch('dishes/getAllDishesFields');
      eventBus.on('showMenuGenerator', () => {
        showMenuGenerator.value = true;
      });
    });

    const createNewProductsParam = () => {
      generatorParams.productConstraints.push({
        productCategory: '',
        condition: 'greaterOrEqual',
        quantity: 0,
      });
    };

    const deleteProductsParam = (key) => {
      generatorParams.productConstraints.splice(key, 1);
    };

    const createNewDishesParam = () => {
      generatorParams.dishTagConstraints.push({
        dishTag: '',
        condition: 'greaterOrEqual',
        quantity: 0,
      });
    };

    const deleteDishesParam = (key) => {
      generatorParams.dishTagConstraints.splice(key, 1);
    };

    const generate = async () => {
      const success = await store.dispatch('menus/generateMenu', generatorParams);
      if (success) {
        emit('generate');
        showMenuGenerator.value = false;
      }
    };

    return {
      productOptions,
      tagsOptions,
      filters,
      showMenuGenerator,
      generatorParams,
      conditionsOptions,
      isGenerateLoading,
      generate,
      createNewProductsParam,
      createNewDishesParam,
      deleteProductsParam,
      deleteDishesParam,
    };
  },
};
</script>

<style lang="scss" scoped>
  .menu-generator {
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-right: 15px;
    }
    &__footer {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
