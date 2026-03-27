export interface BookingConfirmationTemplateData {
  id: string;
  total_price: number;
  check_in_date: string;
  check_out_date: string;
  room: {
    room_number: string;
    hotel: {
      name: string;
      city: string;
    };
  };
}

export const BOOKING_CONFIRMATION_TEMPLATE = (
  data: BookingConfirmationTemplateData,
) => `
  <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee;">
    <h2 style="color: #4CAF50;">StayEase - Booking Confirmed! 🎉</h2>
    <p>Hi, your stay at <b>${data.room.hotel.name}</b> in <b>${data.room.hotel.city}</b> is confirmed.</p>
    <p><b>Order ID:</b> ${data.id}</p>
    <p><b>Room Number:</b> ${data.room.room_number}</p>
    <p><b>Total Price:</b> ₹${data.total_price}</p>
    <p><b>Check-in:</b> ${data.check_in_date}</p>
    <p><b>Check-out:</b> ${data.check_out_date}</p>
    <p>We look forward to hosting you!</p>
  </div>
`;
