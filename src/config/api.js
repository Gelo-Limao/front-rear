import axios from 'axios';

const authAPI = axios.create({
    baseURL: 'https://api-test-geloelimao.herokuapp.com',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default authAPI
