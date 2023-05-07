import { configureStore } from '@reduxjs/toolkit';

function placeholderReducer(state = {}, action) {
  return state;
}


export const store = configureStore({
  reducer: {
    placeholder: placeholderReducer
  }
});
