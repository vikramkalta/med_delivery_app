export async function fetchHelper(options, endpoint) {
  const baseUrl = "http://localhost:8080";

  const apiEndpoint = `${baseUrl}/${endpoint}`;
  try {
    const response = await fetch(apiEndpoint, options);
    return response.json();
  } catch (error) {
    console.log("Something went wrong.", error);
    throw error;
  }
}
