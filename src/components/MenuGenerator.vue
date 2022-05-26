<template>
  <Dialog
    header="Генератор меню"
    v-model:visible="showMenuGenerator"
    :style="{width: '50vw'}"
    :modal="true"
    :draggable="false"
    :dismissableMask="true"
  >
    <div class="menu-generator">
      <div class="menu-generator__content">
        <div class="menu-generator__section">
          <div class="p-fluid p-field">
            <label for="cost">Максимальное допустимая стоимость меню</label>
            <InputText
              v-model="menuCost"
              id="cost"
              type="number"
              placeholder="Стоимость"
              min="1"
            />
          </div>
        </div>
        <div class="menu-generator__section">
          <label class="menu-generator__title">
            <span>Ограничения по продуктам</span>
            <Button
              icon="fas fa-plus-circle"
              class="nutrition-card__btn p-button-rounded p-button-warning"
            />
          </label>
          <div class="p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-6">
                <Dropdown
                  optionLabel="name"
                  placeholder="Категоия продукта"
                />
              </div>
              <div class="p-field p-col-3">
                <Dropdown
                  optionLabel="name"
                  placeholder="Не менее"
                />
              </div>
              <div class="p-field p-col-2">
                <InputText
                  type="number"
                  placeholder="Кол-во"
                  min="1"
                />
              </div>
              <div class="p-field p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="nutrition-card__btn p-button-rounded p-button-warning"
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
            />
          </label>
          <div class="p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-6">
                <Dropdown
                  optionLabel="name"
                  placeholder="Наименование блюда"
                />
              </div>
              <div class="p-field p-col-3">
                <Dropdown
                  optionLabel="name"
                  placeholder="Не менее"
                />
              </div>
              <div class="p-field p-col-2">
                <InputText
                  type="number"
                  placeholder="Кол-во"
                  min="1"
                />
              </div>
              <div class="p-field p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="nutrition-card__btn p-button-rounded p-button-warning"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="menu-generator__footer">
        <Button label="Подобрать" class="p-button-success"/>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted } from 'vue';
import { eventBus } from '@/modules/utils';

export default {
  name: 'MenuGenerator',
  components: {
    Dialog,
    Button,
    InputText,
    Dropdown,
  },
  setup() {
    const showMenuGenerator = ref(false);
    const menuCost = ref(1);

    onMounted(() => {
      eventBus.on('showMenuGenerator', () => {
        showMenuGenerator.value = true;
      });
    });

    return {
      showMenuGenerator,
      menuCost,
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
