interface Auth {
  email: string;
  password: string;
  username?: string
  deviceId?: string;
}
interface Verify {
  email: string;
  code:string
}

export async function login(data: Auth) {
  const response = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message);
  }
  return await response.json();
}
export async function register(data: Auth) {
  const response = await fetch(`/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json()
    console.log(errorData)
    throw new Error(errorData.message);
  }
  return await response.json();
}
export async function verify(data: Verify ) {
  const response = await fetch(`/api/auth/verify`, {
    method:"POST",
    headers: {
      "Content-Type": "application/json",    
    },
    body: JSON.stringify(data),
  })
   if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message);
  }
  return await response.json();
}