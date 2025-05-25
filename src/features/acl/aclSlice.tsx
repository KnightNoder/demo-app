import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ACLButton {
  name: string;
  visible: boolean;
}

interface ACLState {
  buttons: ACLButton[];
}

const initialState: ACLState = {
  buttons: [],
};

const aclSlice = createSlice({
  name: 'acl',
  initialState,
  reducers: {
    setButtons: (state, action: PayloadAction<ACLButton[]>) => {
      state.buttons = action.payload;
    },
    clearButtons: (state) => {
      state.buttons = [];
    },
  },
});

export const { setButtons, clearButtons } = aclSlice.actions;
export default aclSlice.reducer;