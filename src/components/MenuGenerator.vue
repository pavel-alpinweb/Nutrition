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
      <div class="menu-generator__content"></div>
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
import { ref, onMounted } from 'vue';
import { eventBus } from '@/modules/utils';

export default {
  name: 'MenuGenerator',
  components: {
    Dialog,
    Button,
  },
  setup() {
    const showMenuGenerator = ref(false);

    onMounted(() => {
      eventBus.on('showMenuGenerator', () => {
        showMenuGenerator.value = true;
      });
    });

    return {
      showMenuGenerator,
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
