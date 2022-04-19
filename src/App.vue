<template>
  <div class="app">
    <Toast />
    <ConfirmDialog />
    <div class="app-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { eventBus } from '@/modules/utils';
import { token } from '@/modules/api';
import ConfirmDialog from 'primevue/confirmdialog';

export default {
  name: 'App',
  components: {
    Toast,
    ConfirmDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.auth.user);

    onMounted(async () => {
      const toast = useToast();
      eventBus.on('showToast', (data) => {
        toast.add(data);
      });
      eventBus.on('forceRedirect', (url) => {
        router.push(url);
      });
      if (token) {
        await store.dispatch('auth/fetchUser');
      }
    });

    return {
      user,
    };
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background: url('~@/assets/bg.jpg') no-repeat center;
  background-size: cover;
}
</style>
