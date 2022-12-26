import { configureStore } from "@reduxjs/toolkit";
import { user, board, favourites } from "./features"

const store = configureStore({
  reducer: {
    user,
    board,
    favourites,
  }
})

export default store
