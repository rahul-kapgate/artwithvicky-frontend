// utils/fetchWithAuth.ts
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface RefreshTokenResponse {
  accessToken: string;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }

  // Add Authorization header if not present
  const headers: Record<string, string> = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Initial request
  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 403 error by refreshing token
  if (response.status === 403) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    // Call refresh token API
    const refreshResponse = await fetch(
      "https://artwithvicky-backend.onrender.com/api/users/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    console.log("refreshResponse", refreshResponse);

    if (!refreshResponse.ok) {
      throw new Error("Failed to refresh token");
    }

    const refreshData: RefreshTokenResponse = await refreshResponse.json();
    token = refreshData.accessToken;
    localStorage.setItem("accessToken", token);

    // Retry the original request with new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};