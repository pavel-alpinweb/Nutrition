<template>
  <LoginLayout :form-title="'Вход'">
    <div class="registration-step-one">
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-user"></i>
          <InputText
            v-model="userData.userName"
            class="login-input"
            type="text"
            placeholder="Введите логин"
          />
      </span>
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-lock"></i>
          <InputText
            v-model="userData.userPassword"
            class="login-input"
            type="password"
            placeholder="Введите пароль"
            />
      </span>
      <Button class="login-submit-btn" label="Отправить" @click="login"/>
      <div class="login-link-wrapper">
        <router-link class="login-link" to="/registration1">
          Регситрация
        </router-link>
        <router-link class="login-link" to="/restore1">
          Забыли пароль?
        </router-link>
      </div>
    </div>
  </LoginLayout>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import LoginLayout from '@/layouts/LoginLayout.vue';

export default {
  name: 'registrationStepOne',
  components: {
    LoginLayout,
    InputText,
    Button,
  },
  setup() {
    const store = useStore();
    const userData = reactive({
      userName: '',
      userPassword: '',
    });

    const login = async () => {
      await store.dispatch('auth/login', userData);
    };

    return {
      userData,
      login,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-input-wrapper {
  margin-bottom: 15px;
  display: block;
}
.login-input {
  width: 100%;
}
.login-submit-btn {
  width: 100%;
  margin-bottom: 15px;
}
.login-link {
  text-decoration: none;
  color: #007AD9;
}
.login-link-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>
