export default {
  namespaced: true,
  
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || []
  }),

  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
      localStorage.setItem('currentUser', JSON.stringify(user))
    },
    SET_USERS(state, users) {
      state.users = users
      localStorage.setItem('users', JSON.stringify(users))
    },
    LOGOUT(state) {
      state.currentUser = null
      localStorage.removeItem('currentUser')
    }
  },

  actions: {
    login({ commit, state }, credentials) {
      const user = state.users.find(
        u => u.username === credentials.username && 
        u.password === credentials.password
      )
      
      if (user) {
        commit('SET_CURRENT_USER', user)
        return Promise.resolve(user)
      }
      return Promise.reject('Thông tin đăng nhập không hợp lệ')
    },

    register({ commit, state }, userData) {
      const existingUser = state.users.find(u => u.username === userData.username)
      if (existingUser) {
        return Promise.reject('Tên đăng nhập đã tồn tại')
      }

      const newUser = {
        id: state.users.length + 1,
        ...userData
      }
      
      const updatedUsers = [...state.users, newUser]
      commit('SET_USERS', updatedUsers)
      return Promise.resolve(newUser)
    },

    logout({ commit }) {
      commit('LOGOUT')
    }
  },

  getters: {
    isAuthenticated: state => !!state.currentUser,
    currentUser: state => state.currentUser
  }
}