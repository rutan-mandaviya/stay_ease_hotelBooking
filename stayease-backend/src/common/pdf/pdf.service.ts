import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async generateBookingInvoice(booking: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      // Data ko ek memory chunk mein collect karein
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // --- PDF CONTENT START ---
      doc.fontSize(25).text('STAYEASE INVOICE', { align: 'center' }).moveDown();

      doc.fontSize(12).text(`Booking ID: ${booking.id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.fontSize(16).text('Customer Details', { underline: true });
      doc.fontSize(12).text(`Email: ${booking.user.email}`);
      doc.moveDown();

      doc.fontSize(16).text('Booking Details', { underline: true });
      doc.fontSize(12).text(`Hotel: ${booking.room.hotel.name}`);
      doc.text(`Room Number: ${booking.room.room_number}`);
      doc.text(`Check-in: ${booking.check_in_date}`);
      doc.text(`Check-out: ${booking.check_out_date}`);
      doc.moveDown();

      doc
        .fontSize(18)
        .fillColor('green')
        .text(`Total Amount Paid: ₹${booking.total_price}`, { align: 'right' });
      // --- PDF CONTENT END ---

      doc.end();
    });
  }
}
