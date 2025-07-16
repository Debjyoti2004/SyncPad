// Unauthenticated POST request (signup, signin)
export async function postJSON(url: string, data: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}

// Authenticated POST request (create room)
export async function postWithAuthJSON(url: string, data: any, token: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Auth API request failed");
  }

  return res.json();
}
export async function getWithAuthJSON(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Auth API request failed");
  }
  return res.json();
}
