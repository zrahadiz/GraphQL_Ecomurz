import { gql } from "graphql-request";

export const QUERIES = {
  GET_PRODUCTS: gql`
    query GetProducts($category: String, $limit: Int, $offset: Int) {
      products(category: $category, limit: $limit, offset: $offset) {
        id
        name
        description
        price
        category
        stock
        imageUrl
        createdAt
        updatedAt
      }
    }
  `,

  GET_PRODUCT_BY_ID: gql`
    query GetProductById($id: ID!) {
      product(id: $id) {
        id
        name
        description
        price
        category
        stock
        imageUrl
        createdAt
        updatedAt
      }
    }
  `,

  SEARCH_PRODUCTS: gql`
    query SearchProducts($query: String!) {
      searchProducts(query: $query) {
        id
        name
        description
        price
        category
        stock
        imageUrl
      }
    }
  `,

  GET_PRODUCT_STATS: gql`
    query GetProductStats {
      productStats {
        totalProducts
        totalValue
        categories {
          category
          count
          totalValue
        }
        lowStock {
          id
          name
          stock
          price
        }
      }
    }
  `,
};
