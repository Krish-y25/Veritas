import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generates an in-memory A4 Landscape certificate PDF using PDFKit.
 * Output is collected as a Buffer without writing to disk.
 */
export const generateCertificatePdf = ({
  studentName,
  course,
  year,
  grade,
  certId,
  issuedAt,
  organization,
  qrBuffer,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 36,
        autoFirstPage: true,
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const width = doc.page.width;
      const height = doc.page.height;

      // Clean white background
      doc.rect(0, 0, width, height).fill('#FFFFFF');

      // Double-border decorative frame
      doc.rect(20, 20, width - 40, height - 40).lineWidth(3).stroke('#050816');
      doc.rect(26, 26, width - 52, height - 52).lineWidth(1).stroke('#B89B5E');

      // Top logo (gracefully handled if missing)
      const logoPath = path.resolve('assets/bmsce-logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (width - 68) / 2, 40, { width: 68 });
      }

      // Organization name
      const orgName = (organization || 'B.M.S. COLLEGE OF ENGINEERING').toUpperCase();
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#050816')
        .text(orgName, 0, 115, { align: 'center', characterSpacing: 2 });

      // Subtle gold divider
      doc.moveTo(180, 136).lineTo(width - 180, 136).lineWidth(0.75).stroke('#B89B5E');

      // Certificate title
      doc
        .font('Times-Bold')
        .fontSize(25)
        .fillColor('#050816')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 146, { align: 'center' });

      // Body certification text
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('This is to certify that', 0, 186, { align: 'center' });

      doc
        .font('Times-Bold')
        .fontSize(28)
        .fillColor('#050816')
        .text(studentName, 0, 208, { align: 'center' });

      // Underline under student name
      doc
        .moveTo(width / 2 - 160, 244)
        .lineTo(width / 2 + 160, 244)
        .lineWidth(0.75)
        .stroke('#CBD5E1');

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('has successfully completed', 0, 258, { align: 'center' });

      doc
        .font('Helvetica-Bold')
        .fontSize(17)
        .fillColor('#1E293B')
        .text(course, 0, 278, { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#334155')
        .text(`Academic Year: ${year}   •   Grade: ${grade}`, 0, 306, { align: 'center' });

      // Bottom metadata: ID and Issue date
      const formattedDate = new Date(issuedAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc
        .font('Courier-Bold')
        .fontSize(10)
        .fillColor('#050816')
        .text(`Certificate ID: ${certId}`, 52, 450);

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#475569')
        .text(`Issued on: ${formattedDate}`, 52, 468);

      // Bottom-right QR code
      if (qrBuffer) {
        const qrX = width - 132;
        const qrY = 432;
        doc.image(qrBuffer, qrX, qrY, { width: 76, height: 76 });
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#475569')
          .text('Scan to Verify', qrX - 10, qrY + 80, { width: 96, align: 'center' });
      }

      // Bottom subtle Veritas attribution
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor('#64748B')
        .text('Generated using Veritas', 0, height - 42, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
