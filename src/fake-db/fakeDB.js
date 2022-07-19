import axios from "axios";

export const getCustomers = async (id) => {
  const customerUrl = id
    ? "https://jsonplaceholder.typicode.com/users/" + id
    : "https://jsonplaceholder.typicode.com/users";
  return await axios.get(customerUrl);
};
