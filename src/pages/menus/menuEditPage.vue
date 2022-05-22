<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div v-if="isMenuLoaded" class="menu-edit">
        <div class="menu-edit-header p-grid">
          <div class="menu-edit-header__left p-col-6">
            <FileUpload
              name="demo[]"
              url="./upload.php"
              @upload="onUpload"
              :multiple="false"
              accept="image/*"
              :maxFileSize="1000000"
            >
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
            <Image
              v-if="image"
              class="menu-edit__image"
              width="250"
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              alt="Image"
            />
            <div v-else class="menu-edit__default-image">
              <i class="fas fa-utensils"></i>
            </div>
          </div>
          <div class="menu-edit-header__right p-col-6 p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-12">
                <label for="name">Название меню</label>
                <InputText
                  v-model="menu.name"
                  id="name"
                  type="text"
                  placeholder="Название меню"
                  min="0"
                />
              </div>
              <div class="p-field p-col-12">
                <label for="describe">Примечание</label>
                <Textarea
                  v-model="menu.description"
                  id="describe"
                  :autoResize="true"
                  rows="5"
                  cols="30"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="menu-edit-content">
          <Panel header="Блюда входящие в меню">
            <template #icons>
              <Button
                label="Добавить"
                icon="fas fa-plus-circle"
                class="p-button-success"
                @click="addDish"
              />
              <Button
                v-if="!isNewMenu"
                label="Подобрать продукты"
                icon="fas fa-carrot"
                class="p-button-warning"
                @click="pushToPickList()"
              />
            </template>
            <div class="p-grid">
              <div class="p-col-6 p-text-center">
                <h2>Блюдо</h2>
              </div>
              <div class="p-col-6 p-text-center">
                <h2>Количество порций</h2>
              </div>
              <div class="p-col-12">
                <DishSelect
                  v-for="dish in menu.items"
                  :item="dish"
                  :key="dish.index"
                  @changeOption="changeOptionHandler"
                  @inputServingNumber="inputServingNumberHandler"
                  @deleteDish="deleteDishHandler"
                />
              </div>
            </div>
          </Panel>
        </div>
        <div class="menu-edit-footer">
          <div class="p-fluid p-field">
            <label for="tags">Тэги</label>
            <Chips v-model="menu.tags" id="tags"/>
          </div>
          <div class="menu-edit-footer__buttons">
            <Button
              v-if="!isNewMenu"
              label="Новое меню"
              icon="fas fa-plus-circle"
              class="p-button-success"
              @click="addMenu"
            />
            <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="saveMenu"/>
            <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning" @click="reset"/>
          </div>
        </div>
      </div>
      <div v-else class="menu-edit">
        <div class="menu-edit__skeleton-grid">
          <Skeleton class="menu-edit__item menu-edit__item--image" height="25vh"/>
          <Skeleton class="menu-edit__item menu-edit__item--input-1" height="30px"/>
          <Skeleton class="menu-edit__item menu-edit__item--input-2" height="30px"/>
          <Skeleton class="menu-edit__item menu-edit__item--input-3" height="30px"/>
          <Skeleton class="menu-edit__item menu-edit__item--input-4" height="30px"/>
          <Skeleton class="menu-edit__item menu-edit__item--input-5" height="30px"/>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import DishSelect from '@/components/DishSelect.vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import Panel from 'primevue/panel';
import Skeleton from 'primevue/skeleton';
import useUpload from '@/composition/upload';
import {
  computed, reactive, onMounted, watch, ref, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import DishInMenuTemplate from '@/modules/DishInMenuTemplate';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'menuEditPage',
  components: {
    DefaultPageLayout,
    FileUpload,
    InputText,
    Textarea,
    Button,
    Chips,
    Panel,
    DishSelect,
    Skeleton,
  },
  setup() {
    const image = reactive();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const menu = reactive({});
    const dishesArr = ref([]);
    const initialMenu = computed(() => store.state.menus.initialMenu);
    const isMenuLoaded = computed(() => store.state.menus.isMenuLoaded);
    let newIndex = 0;
    const isNewMenu = computed(() => route.params.id === 'new');
    const filters = computed(() => store.state.menus.filters);
    const user = computed(() => store.state.auth.user);

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('menus/getAllMenusFields', user.value.id);
      }
    });

    onMounted(async () => {
      if (!isNewMenu.value) {
        await store.dispatch('menus/getMenuById', route.params.id);
      }
      if (user.value) {
        await store.dispatch('menus/getAllMenusFields', user.value.id);
      }
      Object.assign(menu, initialMenu.value);
      newIndex = menu.items.length;
      dishesArr.value = dishesArr.value.concat(initialMenu.value.items);
      store.commit('setBadge', menu.name);
    });

    onBeforeUnmount(() => {
      store.commit('setBadge', null);
      store.commit('menus/resetInitialMenu');
    });

    const addDish = () => {
      newIndex += 1;
      const dish = new DishInMenuTemplate(newIndex);
      dishesArr.value.push(dish);
      menu.items = dishesArr;
    };
    const pushToPickList = () => {
      router.push('/menus-pick-product-list');
    };
    const reset = () => {
      window.location.replace(`/menu/${route.params.id}`);
    };
    const addMenu = () => {
      window.location.replace('/menu/new');
    };
    const saveMenu = async () => {
      if (isNewMenu.value) {
        await store.dispatch('menus/menuAdd', menu);
        store.commit('setBadge', menu.name);
      } else {
        await store.dispatch('menus/updateMenu', menu);
        store.commit('setBadge', menu.name);
      }
    };
    const changeOptionHandler = (data) => {
      const dish = menu.items.find((item) => item.itemIndex === data.itemIndex);
      dish.dishName = data.value.name;
    };
    const inputServingNumberHandler = (data) => {
      const dish = menu.items.find((item) => item.itemIndex === data.itemIndex);
      dish.servingNumber = data.servingNumber;
    };
    const deleteDishHandler = (itemIndex) => {
      menu.items = menu.items.filter(
        (item) => item.itemIndex !== itemIndex,
      );
    };

    return {
      ...useUpload(),
      pushToPickList,
      addDish,
      changeOptionHandler,
      inputServingNumberHandler,
      deleteDishHandler,
      reset,
      addMenu,
      saveMenu,
      image,
      initialMenu,
      filters,
      menu,
      isNewMenu,
      isMenuLoaded,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-edit {
  padding: 10px;
  &-footer {
    padding: 10px;
  }
  .p-button {
    margin-right: .5rem;
  }
  &__default-image {
    font-size: 300px;
    text-align: center;
    margin-top: 20px;
    color: grey;
  }
  &__skeleton-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 30px;
    grid-template-areas:
        "image image input-1 input-2"
        "image image input-3 input-4"
        "input-5 input-5 input-5 input-5";
    grid-gap: 10px;
  }
  &__item {
    &--image {
      grid-area: image;
    }
    &--input-1 {
      grid-area: input-1;
    }
    &--input-2 {
      grid-area: input-2;
    }
    &--input-3 {
      grid-area: input-3;
    }
    &--input-4 {
      grid-area: input-4;
    }
    &--input-5 {
      grid-area: input-5;
    }
  }
}
</style>
