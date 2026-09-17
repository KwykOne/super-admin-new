import { createSlice } from "@reduxjs/toolkit";
type DataType = "both" | "real" | "test";

const initialState ={
    referrealGivenDetails :{},
    isSidebarCollapsed:false,
    dataType:"real",
    sellerDetails:null,
    mode:'production'

}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setReferrealDetails : (state,action)=>{
            state.referrealGivenDetails = action.payload 
        },
        toggleDashboard : (state)=>{
            state.isSidebarCollapsed = !state.isSidebarCollapsed
        },
        changeDataType:(state,action)=>{
            state.dataType = action.payload
        },
        setSellerDetails : (state,action)=>{
            state.sellerDetails = action.payload
        },
        updateVendorStatus : (state,action)=>{
            if(state.sellerDetails){
                state.sellerDetails.is_active = action.payload
            }
        },
        updateVendorDetails : (state,action)=>{
            if(state.sellerDetails){
                state.sellerDetails = { ...state.sellerDetails, ...action.payload }
            }
        },
        setDevMode:(state)=>{
            state.mode="dev"
        },
        setProdMode:(state)=>{
            state.mode="production"
        }



    }
} )

export const {setReferrealDetails,toggleDashboard,changeDataType,setSellerDetails,updateVendorStatus,updateVendorDetails,setDevMode,setProdMode} = dashboardSlice.actions

export default dashboardSlice.reducer