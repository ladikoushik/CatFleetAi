import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementToPDF = async (elementId, defaultFilename = 'CAT_FleetBrainAI_Report') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Target element not found for PDF capture.');
  }

  // High resolution canvas capture
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#1A1A1A',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${defaultFilename}_${dateStr}.pdf`;
  pdf.save(filename);
  return filename;
};

export const exportDataToCSV = (dataArray, filename = 'CAT_FleetBrainAI_Report.csv') => {
  if (!dataArray || !dataArray.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(dataArray[0]).join(',');
  const rows = dataArray.map((row) =>
    Object.values(row)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
