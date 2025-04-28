/**
 * Returns the endpoint URL for the API based on the environment.
 * @returns {string} The endpoint URL for the API.
 */
export const getEndpoint = () => {
  const env = import.meta.env.PROD;
  const endpoint = env ? import.meta.env.VITE_API_ENDPOINT : "http://localhost:3001";
  return endpoint;
}