import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    isloggedIn: false,
    userData: "",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action) => {
            state.isloggedIn = true,
            state.userData = action.payload
        },
        logOut: (state) => {
            state.isloggedIn = false,
            state.userData = null
        }
    }
})

export const {logIn,logOut} = authSlice.actions;
export default authSlice.reducer
