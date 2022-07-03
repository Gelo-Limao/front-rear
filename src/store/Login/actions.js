import Vue from 'vue';
import authAPI from '../../config/api';

export default {
    async login({commit}, payload){
        commit('CLEAR_ERROR');
        console.log('[ACTION_LOGIN] Payload: ', payload)
        try{
            const response = await authAPI.post('/auth', payload);

            console.log('[ACTION_LOGIN] Response da API: ', response)

            localStorage.TOKEN = response.data?.token;

            const decodedToken = Vue.$jwt.decode(response.data?.token);

            console.log('[ACTION_LOGIN] Setou o token JWT: ', decodedToken)

            authAPI.defaults.headers.common.Authorization = `Bearer ${localStorage.TOKEN}`;

            commit('SET_LOGIN', decodedToken);

        } catch(error) {

            console.log('[ACTION_ERROR_LOGIN] Error: ', error)

            commit('SET_ERROR', error.response.data);

        }
    }
}