import Vue from 'vue';
import Vuex from 'vuex';
import Login from './Login/index';
import Users from './user/index';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        Login,
        Users
    }
});

export default store;
