import Vue from 'vue'
import Vuex from 'vuex'
import tab from './model/tab'
import user from './model/user'
Vue.use(Vuex)


export default new Vuex.Store({
    modules:{
        tab,
        user
    }
})