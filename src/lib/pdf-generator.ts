import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePdf = (element: HTMLElement, filename: string) => {
    html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(filename);
    }).catch(error => {
        console.error("Error generating PDF:", error);
    });
};
