const API_URL = import.meta.env.VITE_API_URL;

export const getExpenses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}/api/expenses?${query}`);
  return res.json();
};