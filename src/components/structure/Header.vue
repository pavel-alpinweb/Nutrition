<template>
  <header class="nutrition-app__header">
    <Menubar :exact="true" :model="items" class="p-tabmenuitem">
      <template #start>
        <div class="profile-btn">
          <Avatar
            icon="fas fa-user-circle"
            size="large"
            shape="circle"
            @click="showProfile()"
          />
        </div>
      </template>
      <template #end>
        <Badge
          v-if="badge"
          icon="fas fa-edit"
          severity="success"
          size="large"
          class="p-mr-2">
          <i class="fas fa-edit"></i>
          {{ badge }}
        </Badge>
      </template>
    </Menubar>
    <Profile />
  </header>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Profile from '@/components/Profile.vue';
import { eventBus } from '@/modules/utils';

export default {
  name: 'Header',
  components: {
    Menubar,
    Avatar,
    Badge,
    Profile,
  },
  setup() {
    const items = ref([
      {
        label: 'Продукты',
        icon: 'fas fa-carrot',
        to: '/',
      },
      {
        label: 'Блюда',
        icon: 'fas fa-concierge-bell',
        to: '/dishes',
      },
      {
        label: 'Меню',
        icon: 'fas fa-utensils',
        to: '/menu',
      },
    ]);
    const store = useStore();
    const logout = () => {
      store.dispatch('auth/logout');
    };
    const showProfile = () => {
      eventBus.emit('showProfile', true);
    };
    return {
      items,
      logout,
      showProfile,
      badge: computed(() => store.state.currentEdit),
    };
  },
};
</script>

<style lang="scss">

.p-menuitem-link:focus {
  box-shadow: none!important;
}
.router-link-active-exact {
  background: #eaeaea;
}

.edit-info {
  margin-bottom: 15px;
  &__footer {
    display: flex;
    justify-content: space-between;
  }
  &__change-password {
    color: #007AD9;
    margin: 15px 0;
    cursor: pointer;
  }
}

.profile-btn {
  cursor: pointer;
  margin-right: 15px;
}
.login-input-wrapper {
  margin-bottom: 15px;
  display: block;
}
.login-input {
  width: 100%;
}
.login-submit-btn {
  margin: 0 auto 15px;
}
</style>
