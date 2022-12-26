import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: []
}

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setFavourites } = favouriteSlice.actions

export const getFavouritesState = state => state.favourites.value

export default favouriteSlice.reducer