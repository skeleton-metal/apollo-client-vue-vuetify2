import router from '../../../../routes'
import graphqlClient from "../../../../apollo";
import AuthProvider from '../providers/AuthProvider'
import jwt_decode from 'jwt-decode'
import Vue from 'vue'

import {
    SET_TOKEN,
    SET_ME_USER,
    SET_AUTH_LOADING,
    SET_GENERAL_ERROR,
    SET_USER_IMG,
    SET_USER_INVALID, AVATAR_UPDATE,
} from './auth-mutations-type'


export default {
    state: {
        access_token: null,
        me: {
            id: null,
            username: null,
            name: null,
            email: null,
            phone: null,
            img: null,
            roles: [],
            avatar: null
        },
        loadingAuth: false,
        generalError: null,
        userInvalid: false,
    },
    getters: {
        me: (state) => {
            return state.me
        },
        getToken: (state) => {
            return state.access_token
        },
        isAuth: (state) => {
            return (state.access_token) ? true : false
        },
        hasRole: (state) => (role) => {
            if (!state.me || !state.me.role) return false
            return state.me.role.name == role
        },
        hasPermission: (state) => (permission) => {
            if (!state.me) return false
            return state.me.role.permissions.includes(permission)
        },
    },
    actions: {
        login({commit}, login) {
            commit(SET_TOKEN, '')
            commit(SET_AUTH_LOADING, true)
            commit(SET_GENERAL_ERROR, "")
            commit(SET_USER_INVALID, false)

            AuthProvider.auth(login.username, login.password).then((response) => {

                commit(SET_TOKEN, response.data.auth.token)
                commit(SET_ME_USER, jwt_decode(response.data.auth.token))
                commit(SET_AUTH_LOADING, false)
                router.push('/')

            }).catch((error) => {

                //Backend no responde
                if (error.networkError) {
                    commit(SET_GENERAL_ERROR, "Imposible conectar con el servidor")
                //Autenticacion fallida
                } else if(error.graphQLErrors[0].extensions.code == 'UNAUTHENTICATED') {
                    commit(SET_GENERAL_ERROR, error.graphQLErrors[0].message)
                //Otros errores
                }else{
                    commit(SET_GENERAL_ERROR, error.message)
                }

                commit(SET_AUTH_LOADING, false)
                commit(SET_USER_INVALID, true)

            })


        },

        me({commit, dispatch}) {
            commit(SET_AUTH_LOADING, true)
            commit(SET_GENERAL_ERROR, "")
            AuthProvider.me().then((response) => {
                commit(SET_ME_USER, response.data.me)
                commit(SET_AUTH_LOADING, false)
            }).catch((error) => {
                commit(SET_GENERAL_ERROR, error)
                commit(SET_AUTH_LOADING, false)
                dispatch('logout')
            })
        },


        avatarChange({commit}, data) {
            commit(SET_AUTH_LOADING, true)
            //console.log(data)
            AuthProvider.avatar(data.id, data.avatar).then((response) => {
                commit(SET_AUTH_LOADING, false)
                commit(SET_USER_IMG, response.data.avatar.image)
            });

        },

        logout({commit}) {
            commit(SET_TOKEN, '')
            commit(SET_ME_USER, [])
            graphqlClient.resetStore()
            router.push('/login')
        },

        checkAuth: ({state, dispatch}) => {
            if (state.access_token) {
                let payload = jwt_decode(state.access_token)
                if (payload.exp) {
                    let dateNow = new Date();
                    let dateToken = new Date(payload.exp * 1000)
                    console.log(dateToken)
                    if (dateNow > dateToken) {
                        console.log("Token expire. Logout.")
                        dispatch('logout')
                    }
                }
            }

        },


    },
    mutations: {
        [SET_TOKEN](state, token) {
            state.access_token = token
        }
        ,
        [SET_ME_USER](state, data) {
            state.me = data
        },
        [AVATAR_UPDATE](state, url) {
            state.me.avatarurl = url
        }
        ,
        [SET_AUTH_LOADING](state, data) {
            state.loadingAuth = data
        }
        ,
        [SET_GENERAL_ERROR](state, data) {
            state.generalError = data
        }
        ,
        [SET_USER_IMG](state, img) {
            state.me.avatar = {image: null}
            Vue.set(state.me.avatar, 'image', img)
        }
        ,
        [SET_USER_INVALID](state, data) {
            state.userInvalid = data
        },

    }
}
