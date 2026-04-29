const API_URL = import.meta.env.VITE_API_URL;

export const getExpenses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}/expenses?${query}`);
  return res.json();
};

export const createExpense = async (data) => {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create expense");
  }

  return res.json();
};