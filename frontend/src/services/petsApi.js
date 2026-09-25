/* --------------------------
   API service between React components and backend API. Frontend UI uses
   adapter to communicate.
   ------------------------- */

// Citation for: Vite Environmental Variables
// Date: 02/05/2026
// Adapted from
// Source URL: https://medium.com/@williampepple/how-to-use-environmental-variables-in-vite-52c97befae3e

// Citation for: Data Fetching, Error Messages
// Date: 02/06/2026
// Adapted from
// Source URL: https://www.builder.io/blog/safe-data-fetching

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Send request to backend and wait for response
async function apiRequest(path, options = {}) {

  // Retrieve JWT token if it exists
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access") ||
    localStorage.getItem("jwt");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      // Attach Authorization header if token exists
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...(options.headers || {})
    },
  });

  // Checks if the response is JSON, respond if it is
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = null;
  }
  
  // If request fails, return error message
  if (!res.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      (data && typeof data === "object" ? JSON.stringify(data) : null) ||
      `Failed Fetch Response: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// If we're passed a petID send the backend a request with it
export function getPets({ petId } = {}) {
  let query = "";

  if (petId) {
    query = "?petId=" + encodeURIComponent(petId);
  }
  
  return apiRequest(`/api/pets/${query}`);
}

// Send the backend a request to delete the pet with petID
export function deletePet(petId) {
  return apiRequest(`/api/pets/${petId}/`, { method: "DELETE" });
}

// Send API request to backend server to create a new pet profile
export function createPet(pet) {
  const cleanedPet = {
    ...pet,
    goodWithChildren: pet.goodWithChildren ? 1 : 0,
    goodWithAnimals: pet.goodWithAnimals ? 1 : 0,
    leashed: pet.leashed ? 1 : 0,
  };

  return apiRequest("/api/pets/", {
    method: "POST",
    body: JSON.stringify(cleanedPet),
  });
}

// Send API request to backend server to update a pet profile
export function updatePet(petId, pet) {
  const cleanedPet = {
    ...pet,
    goodWithChildren: pet.goodWithChildren ? 1 : 0,
    goodWithAnimals: pet.goodWithAnimals ? 1 : 0,
    leashed: pet.leashed ? 1 : 0,
  };

  return apiRequest(`/api/pets/${petId}/`, {
    method: "PATCH",
    body: JSON.stringify(cleanedPet),
  });
}