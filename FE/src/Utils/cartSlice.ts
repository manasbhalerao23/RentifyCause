import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    monthStatus: Array<boolean>;
    shopName: string;
    _id: string;
    username: string;//
    email: string;//
    language: string;
    address:string;//
    contact:string;//
    currentDonation:string;
    currentRent:string;
    monthRent:string;//
    role:string;
    totalDonation:string;//
    

}

const initialState: UserInfo = {
email: "",
language: "English",
address: "",
contact: "",
currentDonation: "",
currentRent: "",
monthRent: "",
role:"",
totalDonation:"",
username: "",
_id:"",
monthStatus: [],
shopName: ""

};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setUser: (_state, action: PayloadAction<UserInfo>) => {
            return action.payload; 
        },
        updateUser: (state, action: PayloadAction<Partial<UserInfo>>) => {
            Object.assign(state, action.payload); 
        },
        clearUser: () => initialState, 
        changeLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
    },
});

export const { setUser, updateUser, clearUser, changeLanguage } = cartSlice.actions;
export default cartSlice.reducer;
