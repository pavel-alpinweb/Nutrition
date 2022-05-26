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
      </div>
      <div class="menu-generator__footer">
        <Button label="Отмена" />
        <Button label="Подобрать" class="p-button-success"/>
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref, onMounted } from 'vue';
import { eventBus } from '@/modules/utils';

export default {
  name: 'MenuGenerator',
  components: {
    Dialog,
    Button,
    InputText,
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
    &__footer {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
