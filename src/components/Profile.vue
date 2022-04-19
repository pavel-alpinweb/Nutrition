<template>
  <Dialog
    header="Профиль"
    v-model:visible="showProfile"
    :style="{width: '25vw'}"
    :modal="true"
    :draggable="false"
    :dismissableMask="true"
  >
    <Accordion class="edit-info__change-password" :multiple="true" :activeIndex="[0]">
      <AccordionTab>
        <template #header>
          <span>
            <i class="fas fa-user"></i> Сменить логин и почту
          </span>
        </template>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-user"></i>
          </span>
            <InputText
              v-model="userData.userName"
              class="login-input"
              type="text"
              :placeholder="`Текущий логин: ${user.name}`"
            />
          </div>
        </div>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-envelope"></i>
          </span>
            <InputText
              v-model="userData.userEmail"
              class="login-input"
              type="text"
              :placeholder="`Текущая почта: ${user.email}`"
            />
          </div>
        </div>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-lock"></i>
          </span>
            <InputText
              v-model="userData.userPassword"
              class="login-input"
              type="password"
              placeholder="Введите пароль для подтверждения"
            />
          </div>
        </div>
        <div class="edit-info__footer">
          <Button
            class="p-button-success"
            label="Сохранить"
            @click="changeLoginAndEmail"
          />
        </div>
      </AccordionTab>
      <AccordionTab>
        <template #header>
          <span>
            <i class="fas fa-lock"></i> Сменить пароль
          </span>
        </template>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-lock"></i>
          </span>
            <InputText
              v-model="userPassword.userCurrentPassword"
              class="login-input"
              type="password"
              placeholder="Текущий пароль"
            />
          </div>
        </div>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-lock"></i>
          </span>
            <InputText
              v-model="userPassword.userNewPassword"
              class="login-input"
              type="password"
              placeholder="Новый пароль"
            />
          </div>
        </div>
        <div class="edit-info">
          <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
              <i class="fas fa-lock"></i>
          </span>
            <InputText
              v-model="userPassword.userNewPasswordAgain"
              class="login-input"
              type="password"
              placeholder="Новый пароль еще раз"
            />
          </div>
        </div>
        <Button
          class="p-button-warning"
          label="Сменить пароль"
          @click="changePassword"
        />
      </AccordionTab>
    </Accordion>
    <Button
      class="login-submit-btn"
      icon="fas fa-power-off"
      label="Выйти"
      @click="logout"
    />
  </Dialog>
</template>

<script>
import {
  reactive, computed, ref, onMounted, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { eventBus } from '@/modules/utils';

export default {
  name: 'Profile',
  components: {
    Dialog,
    InputText,
    Button,
    Accordion,
    AccordionTab,
  },
  setup() {
    const store = useStore();
    const userData = reactive({
      userName: '',
      userEmail: '',
      userPassword: '',
    });
    const userPassword = reactive({
      userCurrentPassword: '',
      userNewPassword: '',
      userNewPasswordAgain: '',
    });
    const showProfile = ref(false);

    const logout = () => {
      store.dispatch('auth/logout');
    };

    const changeLoginAndEmail = async () => {
      await store.dispatch('auth/changeLoginAndEmail', userData);
      userData.userName = '';
      userData.userEmail = '';
      userData.userPassword = '';
    };

    const changePassword = async () => {
      const data = {
        userNewPassword: userPassword.userNewPassword,
        userCurrentPassword: userPassword.userCurrentPassword,
      };
      await store.dispatch('auth/changePassword', data);
      userPassword.userCurrentPassword = '';
      userPassword.userNewPassword = '';
      userPassword.userNewPasswordAgain = '';
    };

    onMounted(() => {
      eventBus.on('showProfile', (show) => {
        showProfile.value = show;
      });
    });

    onBeforeUnmount(() => {
      eventBus.off('showProfile');
    });
    return {
      user: computed(() => store.state.auth.user),
      logout,
      userData,
      userPassword,
      showProfile,
      changeLoginAndEmail,
      changePassword,
    };
  },
};
</script>

<style scoped>

</style>
