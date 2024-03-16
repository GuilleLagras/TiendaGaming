import { expect } from "chai";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');



describe('Get All Products', () => {

  it('should get all products', async () => {

    const response = await requester.get('/products').query({ limit: 10 });

    expect(response.body).to.have.all.keys("hasNextPage", "hasPrevPage", "nextLink", "page", "payload", "prevLink", "status", "totalPages");
    expect(response.body.payload).to.be.an('array');
  });
});

describe('Products testing , CRUD operations', () => {

  let productId;

  it('should create a new product', async () => {
    const productMock = {
      title: "Products Test",
      description: "descripcion",
      price: 89000,
      category: "Electronica",
      code: "PROBANDO",
      stock: 50,
      status: true,
      thumbnails: ["https://imagen.com/imagen.jpg"],
      owner: "Admin",
      ownerEmail: "adminCoder@coder.com"
    };

    const response = await requester
      .post('/products')
      .send(productMock)

    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal('Producto agregado correctamente');
    expect(response.body.product).to.have.property('_id');


    productId = response.body.product._id;
  });

  it('should update an existing product', async () => {
    const updatedProductMock = {
      title: 'Updated Product',
      price: 60000,
    };

    const response = await requester.put(`/products/${productId}`).send(updatedProductMock)

    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal('Producto actualizado correctamente');
  });

  it('should get a specific product by ID', async () => {
    const response = await requester.get(`/products/${productId}`);

    expect(response.body).to.be.an('object');
    expect(response.body.product.title).to.equal("Updated Product");
  });

  it('should delete the created product', async () => {
    const response = await requester.delete(`/products/${productId}`)
      .expect(200);

    expect(response.body.message).to.equal('Producto eliminado correctamente')
  });

});
