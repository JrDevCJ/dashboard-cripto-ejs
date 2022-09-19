import axios from "axios";

const api = axios.create({
  baseURL: "https://api.mercadobitcoin.net/api/v4/"
});

export default api;
