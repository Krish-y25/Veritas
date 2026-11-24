import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generates an in-memory A4 Landscape certificate PDF using PDFKit.
 * Output is collected as a Buffer without writing to disk.
 * Strictly 1 page with zero auto-pagination.
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
        margin: 0,
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
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const assetPath = path.resolve(currentDir, '../../assets/bmsce-logo.png');
      const logoPath = fs.existsSync(assetPath)
        ? assetPath
        : fs.existsSync(path.resolve('assets/bmsce-logo.png'))
        ? path.resolve('assets/bmsce-logo.png')
        : null;

      if (logoPath) {
        doc.image(logoPath, (width - 68) / 2, 38, { width: 68 });
      }

      // Organization name
      const orgName = (organization || 'B.M.S. COLLEGE OF ENGINEERING').toUpperCase();
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor('#050816')
        .text(orgName, 0, 112, { align: 'center', width, characterSpacing: 2, lineBreak: false });

      // Subtle gold divider
      doc.moveTo(180, 132).lineTo(width - 180, 132).lineWidth(0.75).stroke('#B89B5E');

      // Certificate title
      doc
        .font('Times-Bold')
        .fontSize(24)
        .fillColor('#050816')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 142, { align: 'center', width, lineBreak: false });

      // Body certification text
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('This is to certify that', 0, 178, { align: 'center', width, lineBreak: false });

      doc
        .font('Times-Bold')
        .fontSize(27)
        .fillColor('#050816')
        .text(studentName, 0, 198, { align: 'center', width, lineBreak: false });

      // Underline under student name
      doc
        .moveTo(width / 2 - 160, 232)
        .lineTo(width / 2 + 160, 232)
        .lineWidth(0.75)
        .stroke('#CBD5E1');

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('has successfully completed', 0, 244, { align: 'center', width, lineBreak: false });

      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#1E293B')
        .text(course, 0, 264, { align: 'center', width, lineBreak: false });

      doc
        .font('Helvetica')
        .fontSize(11.5)
        .fillColor('#334155')
        .text(`Academic Year: ${year}   •   Grade: ${grade}`, 0, 290, { align: 'center', width, lineBreak: false });

      // Bottom metadata: ID and Issue date safely above y = 515
      const formattedDate = new Date(issuedAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      doc
        .font('Courier-Bold')
        .fontSize(10)
        .fillColor('#050816')
        .text(`Certificate ID: ${certId}`, 52, 436, { lineBreak: false });

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#475569')
        .text(`Issued on: ${formattedDate}`, 52, 454, { lineBreak: false });

      // Bottom-right QR code safely above y = 515
      if (qrBuffer) {
        const qrSize = 70;
        const qrX = width - 128;
        const qrY = 418;
        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#475569')
          .text('Scan to Verify', qrX - 13, qrY + qrSize + 4, { width: 96, align: 'center', lineBreak: false });
      }

      // Bottom subtle Veritas attribution centered inside bottom inner border
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor('#64748B')
        .text('Generated using Veritas', 0, height - 52, { align: 'center', width, lineBreak: false });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
