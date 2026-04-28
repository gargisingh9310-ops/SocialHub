import { LOGIN, LOGOUT } from './authActions'

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true', // ✅ fix

  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,

  token: localStorage.getItem('token') || null,

  // ✅ NEW: stats add karo
  stats: {
    friends: 0,
    views: 0,
    messages: 0
  }
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {

    case LOGIN:
      const { token, user } = action.payload

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true') // ✅ string me store karo

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
        token: null,
        stats: { friends: 0, views: 0, messages: 0 } // reset
      }

    // ✅ NEW CASE
    case "SET_STATS":
      return {
        ...state,
        stats: action.payload
      }

    default:
      return state
  }
}