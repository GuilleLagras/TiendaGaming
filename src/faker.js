import { faker } from '@faker-js/faker'


export const generateProduct = () => {
    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        category: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(),
        stock: faker.number.int(100),
        status: true,
        thumbnails: faker.image.url()

    }
    return product
}
