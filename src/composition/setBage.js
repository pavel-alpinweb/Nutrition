import { onBeforeUnmount, onMounted } from 'vue';
import { useStore } from 'vuex';

export default function useSetBage(name) {
  const store = useStore();
  onMounted(() => {
    store.commit('setBadge', name);
  });
  onBeforeUnmount(() => {
    store.commit('setBadge', null);
  });
}
