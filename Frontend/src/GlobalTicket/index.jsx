// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Crie um slice
const valueSlice = createSlice({
  name: 'value',
  initialState: { value: null },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload;
    }
  }
});

// Exporte as ações e o reducer
export const { setValue } = valueSlice.actions;
const reducer = {
  value: valueSlice.reducer
};

// Configure a store
const globalTicket = configureStore({
  reducer,
});

export default globalTicket;
