import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  uid: string | null;
  email: string | null;
  name: string | null;
  role: 'patient' | 'doctor' | 'admin' | null;
  isLoggedIn: boolean;
  profileComplete: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  name: null,
  role: null,
  isLoggedIn: false,
  profileComplete: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.isLoggedIn = true;
      state.profileComplete = action.payload.profileComplete;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      state.uid = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.isLoggedIn = false;
      state.profileComplete = false;
    },
  },
});

export const { setUser, updateProfile, logout } = userSlice.actions;
export default userSlice.reducer;
