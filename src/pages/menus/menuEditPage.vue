<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div v-if="isMenuLoaded" class="edit-page">
        <div class="edit-page-header p-grid">
          <div class="edit-page-header__left p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12">
            <Image
              v-if="menu.imageUrl"
              class="edit-page__image"
              width="250"
              :src="menu.imageUrl"
              alt="Image"
            />
            <div v-else class="edit-page__default-image">
              <i class="fas fa-utensils"></i>
            </div>
            <FileUpload
              class="edit-page__upload"
              name="demo[]"
              :multiple="false"
              accept="image/*"
              :maxFileSize="250000"
              :customUpload="true"
              @uploader="myUploader"
            >
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
          </div>
          <div class="edit-page-header__right p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12 p-formgrid">
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
        <div class="edit-page-content edit-page__button-container">
          <h2>Блюда входящие в меню:</h2>
          <Panel>
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
                <h3>Блюдо</h3>
              </div>
              <div class="p-col-6 p-text-center">
                <h3>Количество порций</h3>
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
        <div class="edit-page-footer">
          <div class="p-fluid p-field">
            <label for="tags">Тэги</label>
            <AutoComplete
              v-model="menu.tags"
              placeholder="Добавте тэги для меню"
              id="tags"
              :suggestions="filteredSuggestions"
              :multiple="true"
              :dropdown="true"
              @complete="searchFromSuggestions"
              @keyup.enter="createNewTag"
            />
          </div>
          <div class="edit-page-footer__buttons edit-page__button-container">
            <Button
              v-if="!isNewMenu"
              label="Новое меню"
              icon="fas fa-plus-circle"
              class="p-button-success"
              @click="addMenu"
            />
            <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="saveMenu"/>
            <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning" @click="reset"/>
            <Button
              v-if="isNewMenu"
              label="Подобрать меню"
              icon="fas fa-clipboard-list"
              class="p-button-success"
              @click="showMenuGenerator"
            />
          </div>
        </div>
      </div>
      <div v-else class="edit-page">
        <div class="edit-page__skeleton-grid">
          <Skeleton class="edit-page__item edit-page__item--image" height="25vh"/>
          <Skeleton class="edit-page__item edit-page__item--input-1" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-2" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-3" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-4" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-5" height="30px"/>
        </div>
      </div>

      <MenuGenerator @generate="generateHandler"/>
    </template>
  </DefaultPageLayout>
</template>

<script>
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import DishSelect from '@/components/DishSelect.vue';
import MenuGenerator from '@/components/MenuGenerator.vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import AutoComplete from 'primevue/autocomplete';
import Panel from 'primevue/panel';
import Skeleton from 'primevue/skeleton';
import Image from 'primevue/image';
import useUpload from '@/composition/upload';
import {
  computed, reactive, onMounted, ref, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import DishInMenuTemplate from '@/modules/DishInMenuTemplate';
import { useRoute, useRouter } from 'vue-router';
import { eventBus } from '@/modules/utils';

export default {
  name: 'menuEditPage',
  components: {
    DefaultPageLayout,
    FileUpload,
    InputText,
    Textarea,
    Button,
    Panel,
    DishSelect,
    Skeleton,
    MenuGenerator,
    Image,
    AutoComplete,
  },
  setup() {
    const image = reactive();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const filteredSuggestions = ref();
    const menu = reactive({});
    const dishesArr = ref([]);
    const initialMenu = computed(() => store.state.menus.initialMenu);
    const isMenuLoaded = computed(() => store.state.menus.isMenuLoaded);
    let newIndex = 0;
    const isNewMenu = computed(() => route.params.id === 'new');
    const filters = computed(() => store.state.menus.filters);

    onMounted(async () => {
      if (!isNewMenu.value) {
        await store.dispatch('menus/getMenuById', route.params.id);
      }
      await store.dispatch('menus/getAllMenusFields');
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
      router.push(`/menus-pick-product-list/${route.params.id}`);
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
    const myUploader = async (event) => {
      const result = await store.dispatch('menus/uploadImage', event.files[0]);
      menu.imageUrl = result.body;
    };

    const showMenuGenerator = () => {
      eventBus.emit('showMenuGenerator');
    };

    const searchFromSuggestions = (event) => {
      setTimeout(() => {
        const mapTags = filters.value.menuTags.map((item) => item.name);
        if (!event.query.trim().length) {
          filteredSuggestions.value = [...mapTags];
        } else {
          filteredSuggestions.value = mapTags
            .filter((item) => item.toLowerCase().startsWith(event.query.toLowerCase()));
        }
      }, 250);
    };

    const createNewTag = (event) => {
      if (event.target.value.trim().length) {
        menu.tags.push(event.target.value);
      }
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    };

    const generateHandler = () => {
      Object.assign(menu, initialMenu.value);
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
      showMenuGenerator,
      myUploader,
      createNewTag,
      searchFromSuggestions,
      generateHandler,
      filteredSuggestions,
      image,
      initialMenu,
      filters,
      menu,
      isNewMenu,
      isMenuLoaded,
      AutoComplete,
    };
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/edit-page.scss";
</style>
