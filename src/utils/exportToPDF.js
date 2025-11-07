import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = ({
  title,
  columns,
  rows,
  filename = "records.pdf",
  filters = {},
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  const filterSummary = Object.entries(filters)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("  |  ");
  if (filterSummary) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Filters: ${filterSummary}`, 14, 25);
  }

  autoTable(doc, {
    startY: 35,
    head: [columns],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 150, 136] },
    tableWidth: "auto", 
    margin: { left: 14, right: 14 },
  });

  doc.save(filename);
};
