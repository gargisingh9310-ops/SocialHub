import { LOGIN, LOGOUT } from './authActions'

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === true || false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      const { token, user } = action.payload
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', true)
      return {
        ...state,
        isLoggedIn: true,
        user,
        token
      }

    case LOGOUT:
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null
      }

    default:
      return state
  }
}