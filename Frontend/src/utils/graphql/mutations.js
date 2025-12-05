import { gql } from "graphql-request";

export const MUTATIONS = {
  ADD_PRODUCT: gql`
    mutation AddProduct($input: ProductInput!) {
      addProduct(input: $input) {
        id
        name
        description
        price
        category
        stock
        imageUrl
        createdAt
      }
    }
  `,

  UPDATE_PRODUCT: gql`
    mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
      updateProduct(id: $id, input: $input) {
        id
        name
        description
        price
        category
        stock
        imageUrl
        updatedAt
      }
    }
  `,

  DELETE_PRODUCT: gql`
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id)
    }
  `,

  UPDATE_STOCK: gql`
    mutation UpdateStock($id: ID!, $quantity: Int!) {
      updateStock(id: $id, quantity: $quantity) {
        id
        name
        stock
        updatedAt
      }
    }
  `,
};
