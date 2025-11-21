const BASE = process.env.REACT_APP_API_BASE || "";

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const msg =
      data && data.message ? data.message : res.statusText || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function login({ phone, password }) {
  // If no BASE provided, fallback to a safe mock to avoid breaking dev builds
  if (!BASE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const digits = (phone || "").replace(/\D/g, "");
        if (digits === "00000000000")
          return reject(new Error("Account not found."));
        if (password === "wrong")
          return reject(new Error("Incorrect password."));
        const token = "demo-token-" + Date.now();
        try {
          localStorage.setItem("authToken", token);
        } catch (e) {}
        resolve({ ok: true, token });
      }, 600);
    });
  }

  const url = `${BASE.replace(/\/$/, "")}/api/auth/login`;
  const data = await postJson(url, { phone, password });
  if (data?.token) {
    try {
      localStorage.setItem("authToken", data.token);
    } catch (e) {}
  }
  return data;
}

export async function signup(payload) {
  if (!BASE) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const digits = (payload.phone || "").replace(/\D/g, "");
        if (digits === "00000000000")
          return reject(new Error("Phone already registered."));
        const token = "demo-token-" + Date.now();
        try {
          localStorage.setItem("authToken", token);
        } catch (e) {}
        resolve({ ok: true, token });
      }, 700);
    });
  }

  const url = `${BASE.replace(/\/$/, "")}/api/auth/signup`;
  const data = await postJson(url, payload);
  if (data?.token) {
    try {
      localStorage.setItem("authToken", data.token);
    } catch (e) {}
  }
  return data;
}
