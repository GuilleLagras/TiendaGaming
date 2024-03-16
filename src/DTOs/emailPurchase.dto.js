
export default class EmailProductDTO {
  constructor(title, quantity, price) {
    this.title = title;
    this.quantity = quantity;
    this.price = price;
  }

  static formatForEmail(products) {
    return products.map(item => new EmailProductDTO(item.product.title, item.quantity, item.product.price));
  }
}
