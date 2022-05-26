<template>
  <Dialog
    header="Генератор меню"
    v-model:visible="showMenuGenerator"
    :style="{width: '50vw'}"
    :modal="true"
    :draggable="false"
    :dismissableMask="true"
  >
    content
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import { ref, onMounted } from 'vue';
import { eventBus } from '@/modules/utils';

export default {
  name: 'MenuGenerator',
  components: {
    Dialog,
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

<style scoped>

</style>
