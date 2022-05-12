const state = {
  pageName: 'Меню',
  menuslist: [
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Новогоднее',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Соялнка', code: 'dishes4' },
      ],
      tags: [
        { name: 'Тэг 1', code: 'markets1' },
        { name: 'Тэг 2', code: 'markets2' },
        { name: 'Красные', code: 'grade1' },
        { name: 'Розовые', code: 'grade2' },
        { name: 'Турецкие', code: 'grade3' },
      ],
    },
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Завтрак 1',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Соялнка', code: 'dishes4' },
      ],
    },
    {
      id: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      userId: 'bb4b4c3a-98f1-424e-b7cc-3729d6fc5444',
      name: 'Обед',
      averagePrice: 100.25,
      description: null,
      imagePath: null,
      type: 'menu',
      dishes: [
        { name: 'Блюдо 1', code: 'dishes1' },
        { name: 'Блюдо 2', code: 'dishes2' },
        { name: 'Курица по Китайски', code: 'dishes3' },
        { name: 'Соялнка', code: 'dishes4' },
      ],
    },
  ],
  isMenuLoaded: true,
  filters: {
    menuNames: [
      {
        name: 'Постное',
        code: 'post',
      },
    ],
    menuTags: [
      {
        name: 'Постное',
        code: 'postag',
      },
      {
        name: 'Студентческое',
        code: 'Students',
      },
    ],
    dishNames: [
      {
        name: 'Греча с сахаром',
        code: 'grecha1',
      },
      {
        name: 'И еще греча',
        code: 'grecha2',
      },
      {
        name: 'Ничего кроме гречи тебе не светит',
        code: 'grecha3',
      },
    ],
  },
  initialMenu: {
    name: 'Постное',
    imageUrl: null,
    description: 'Очень длинное описание, но короткое',
    items: [
      {
        dishName: 'Греча с сахаром',
        servingNumber: 1,
      },
      {
        dishName: 'И еще греча',
        servingNumber: 1,
      },
      {
        dishName: 'Ничего кроме гречи тебе не светит',
        servingNumber: 1,
      },
    ],
    tags: [
      'Постное',
      'Студентческое',
    ],
  },
};

export default {
  namespaced: true,
  state,
};
