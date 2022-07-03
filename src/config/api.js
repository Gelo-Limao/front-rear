import axios from 'axios';

export const authAPI = axios.create({
    baseURL: 'https://api-test-geloelimao.herokuapp.com',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});
