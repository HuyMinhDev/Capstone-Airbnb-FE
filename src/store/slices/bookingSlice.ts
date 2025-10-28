import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingState {
  check_in: string;
  check_out: string;
  guest_quantity: number;
  totalDay: number;
  location_id: number | null;
  isModalPaymentOpen: boolean;
  isModalReBookingOpen: boolean;
  isModalCalendarOpen: boolean;
  tienTruocThue: number;
}

const initialState: BookingState = {
  check_in: new Date().toISOString(),
  check_out: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  guest_quantity: 1,
  totalDay: 1,
  location_id: null,
  isModalPaymentOpen: false,
  isModalReBookingOpen: false,
  isModalCalendarOpen: false,
  tienTruocThue: 0,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCheck_in: (state, action: PayloadAction<string>) => {
      state.check_in = action.payload;
    },
    setCheck_out: (state, action: PayloadAction<string>) => {
      state.check_out = action.payload;
    },
    setGuest_quantity: (state, action: PayloadAction<number>) => {
      state.guest_quantity = action.payload;
    },
    setTotalDay: (state, action: PayloadAction<number>) => {
      state.totalDay = action.payload;
    },
    setLocation_id: (state, action: PayloadAction<number | null>) => {
      state.location_id = action.payload;
    },
    setIsModalPaymentOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalPaymentOpen = action.payload;
    },
    setIsModalReBookingOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalReBookingOpen = action.payload;
    },
    setIsModalCalendarOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalCalendarOpen = action.payload;
    },
    setTienTruocThue: (state, action: PayloadAction<number>) => {
      state.tienTruocThue = action.payload;
    },

    resetBooking: () => initialState,
  },
});

export const {
  setCheck_in,
  setCheck_out,
  setGuest_quantity,
  setTotalDay,
  resetBooking,
  setLocation_id,
  setIsModalPaymentOpen,
  setIsModalReBookingOpen,
  setIsModalCalendarOpen,
  setTienTruocThue,
} = bookingSlice.actions;

export default bookingSlice.reducer;
