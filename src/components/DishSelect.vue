<template>
  <div class="dish-select">
    <Card class="p-mb-2">
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">
            <div class="p-grid p-fluid">
              <div class="p-col-12">
                <Dropdown
                  v-model="dishesOptions.selectedOption.value"
                  :options="dishesOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="dishPlaceholder"
                  @change="changeHandler($event, item.index)"
                />
              </div>
            </div>
          </div>
          <div class="p-col-6">
            <div class="p-grid p-fluid">
              <div class="p-col-11">
                <InputText
                  v-model="servingNumber"
                  class="ingredient__text"
                  type="number"
                  min="1"
                  @input="inputServingNumber"
                />
              </div>
              <div class="p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="p-button-rounded p-button-danger"
                  @click="deleteDish"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import useOptions from '@/composition/selectOptions';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DishSelect',
  components: {
    Card,
    Dropdown,
    InputText,
    Button,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const dishNames = computed(() => store.state.menus.filters.dishNames);
    const dishPlaceholder = computed(() => (props.item.dishName ? props.item.dishName : 'Выберите блюдо'));
    const dishesOptions = useOptions(dishNames);
    const servingNumber = ref(props.item.servingNumber);

    const changeHandler = (event, index) => {
      const data = {
        value: event.value,
        index,
      };
      emit('changeOption', data);
    };

    const inputServingNumber = () => {
      emit('inputServingNumber', { index: props.item.index, servingNumber: servingNumber.value });
    };
    const deleteDish = () => {
      emit('deleteDish', props.item.index);
    };

    return {
      dishesOptions,
      changeHandler,
      dishPlaceholder,
      servingNumber,
      inputServingNumber,
      deleteDish,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
