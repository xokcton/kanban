import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: []
}

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { setBoards } = boardSlice.actions

export const getBoardsState = state => state.board.value

export default boardSlice.reducer