import { createSlice } from "@reduxjs/toolkit";

interface tokenInfo{
    token: string
  }

  const initialState: tokenInfo = {
    token: ""
  }
  

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        addToken: (_state,action)=>{
            return action.payload
        },
        removeToken: ()=>{
         return { token:""}
        }
    }
})
export const {addToken,removeToken}=authSlice.actions
export default authSlice.reducer;


