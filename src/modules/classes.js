export default class IngredientTemplate {
  constructor(index) {
    this.index = index;
    this.quantity = 0;
    this.filter = {
      category: null,
      shops: [],
      grades: [],
      manufacturers: [],
      tags: [],
    };
  }
}
