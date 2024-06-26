import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import commentReducer from "../slices/commentSlice";

const store=configureStore({
    reducer:{
        auth:authReducer,
        comment:commentReducer,
    }
    //Todo: add more slices here for posts
})

export default store;