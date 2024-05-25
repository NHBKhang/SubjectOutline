import axios from "axios";
import getENV from "./Config";

const { BASE_URL } = getENV();

export const endpoints = {
    'recovery-password': '/mail/recovery-password/',
}

export default axios.create({
    baseURL: BASE_URL
});
