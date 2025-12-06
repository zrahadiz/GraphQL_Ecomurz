export const graphqlClient = async (query, variables = {}) => {
  try {
    const response = await fetch(import.meta.env.VITE_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error(result.errors[0].message);
    }

    return result;
  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
};
