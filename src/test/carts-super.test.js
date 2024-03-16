import { expect } from "chai";
import { CartModel } from "../dao/Mongo/models/Cart.model.js";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');



describe('Get All Carts', () => {

  it('should get all carts', async () => {

    const response = await requester.get('/api/carts')

    expect(response.body).to.have.all.keys("carts", "message");
    expect(response.body).to.be.an('object');
  });
});

describe('Carts testing , CRUD operations', () => {

  let cartsId;
  let originalCollection;

  before(async () => {
    originalCollection = await CartModel.find({});
  });

  after(async () => {
    await CartModel.deleteMany({});
    await CartModel.insertMany(originalCollection);
  });

  it('should create a cart', async () => {
    const response = await requester.post('/api/carts');

    expect(response.body).to.be.an('object');
    expect(response.body.Cart).to.have.property('_id');

    cartsId = response.body.Cart._id;
  });

  it('should update a cart with a product and a quantity', async () => {
    const cartMock = {
      "products": [
        {
          "product": "65b19ebc3250bf4167b53ab2",
          "quantity": 5
        },
        {
          "product": "65b19f183250bf4167b53ab6",
          "quantity": 2
        }
      ]
    }
    const response = await requester.put(`/api/carts/${cartsId}`).send(cartMock).expect(200)
    expect(response.body).to.be.an('object')
    expect(response.body).to.have.property('products');
  })

  it('should get a specific product by ID', async () => {
    const response = await requester.get(`/api/carts/${cartsId}`);

    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('cart');
  });

  it('should remove one product from the cart', async () => {
    const response = await requester.delete(`/api/carts/${cartsId}/products/65b19ebc3250bf4167b53ab2`).expect(200);

    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('updatedCart');
  });

  it('should update quantity of the product', async () => {
    const updateProductQuantity = {
      "quantity": 5
    }
    const response = await requester.put(`/api/carts/${cartsId}/products/65b19f183250bf4167b53ab6`).send(updateProductQuantity).expect(200)
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('products');
    expect(response.body.products).to.be.an('array');

  })

  it('should empty the cart', async () => {
    const response = await requester.delete(`/api/carts/${cartsId}`).expect(200)
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('Se ha vaciado el carrito');
  })

}); 