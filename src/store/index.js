import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const TOKEN_KEY = 'access_token'
export default new Vuex.Store({
    state: {
        token: localStorage.getItem(TOKEN_KEY) || '' // ① 先读缓存
    },
    getters: {
        token: state => state.token
    },
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload || ''
            if (payload) {
                localStorage.setItem(TOKEN_KEY, payload) // ② 持久化
            } else {
                localStorage.removeItem(TOKEN_KEY)
            }
        }
    },
    actions: {
        login({ commit }, token) {
            commit('SET_TOKEN', token)
        },
        logout({ commit }) {
            commit('SET_TOKEN', '')
        }
    }
})