"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import arialgeobold from "../../public/fonts/arial_geo";

interface ExaminationRecord {
  date: string;
  height: string;
  weight: string;
  result: string;
  nextDate: string;
  examinationStampImage: string; // base64 image string
}

interface HealthCardPDFProps {
  formData: {
    name: string;
    firstName: string;
    birthDate: string;
    pesel: string;
    organization: string;
    registrationNumber: string;
    clinicStamp: string;
    regon: string;
    clinicStampImage: string; // base64 image string
  };
  examinations: ExaminationRecord[];
}

export default function HealthCardPDF({
  formData,
  examinations,
}: HealthCardPDFProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("arial_geo-bold-italic.ttf", arialgeobold);
    doc.addFont("arial_geo-bold-italic.ttf", "arialGeoBoldItalic", "normal");
    doc.setFont("arialGeoBoldItalic");

    doc.setFontSize(20);
    doc.text("KARTA", 105, 25, { align: "center" });
    doc.text("ZDROWIA SPORTOWCA", 105, 35, { align: "center" });

    doc.setFontSize(12);

    // Dane osobowe – lewa kolumna
    const leftLabels = [
      "Nazwisko:",
      "Imię/Imiona:",
      "Data urodz.:",
      "PESEL:",
      "Numer rejestru:",
      "Organizacja sportowa:",
    ];
    const leftValues = [
      formData.name,
      formData.firstName,
      formData.birthDate,
      formData.pesel,
      formData.registrationNumber,
      formData.organization,
    ];

    let yLeft = 50;
    const maxWidth = 170;
    const lineSpacing = 18;

    for (let i = 0; i < leftLabels.length; i++) {
      if (leftLabels[i] === "Organizacja sportowa:") {
        const orgText = `${leftLabels[i]} ${leftValues[i]}`;
        const orgLines = doc.splitTextToSize(orgText, maxWidth);
        doc.text(orgLines, 20, yLeft);
        doc.line(
          20,
          yLeft + 5 + (orgLines.length - 1) * 7,
          190,
          yLeft + 5 + (orgLines.length - 1) * 7
        );
        yLeft += orgLines.length * 7 + 10;
      } else {
        doc.text(`${leftLabels[i]} ${leftValues[i]}`, 20, yLeft);
        doc.line(20, yLeft + 5, 110, yLeft + 5);
        yLeft += lineSpacing;
      }
    }

    // Prawa kolumna – pieczątka i REGON
    let yRight = 70;

    if (formData.clinicStampImage) {
      const imageType = formData.clinicStampImage.startsWith("data:image/jpeg")
        ? "JPEG"
        : "PNG";
      doc.addImage(
        formData.clinicStampImage,
        imageType,
        140,
        yRight - 10,
        50,
        30
      );
      yRight += 30;
    }

    doc.setFontSize(10);
    doc.text("(pieczątka poradni)", 140, yRight);
    yRight += 10;

    const clinicStampLines = doc.splitTextToSize(
      formData.clinicStamp || "",
      50
    );
    doc.setFontSize(11);
    doc.text(clinicStampLines, 140, yRight);
    yRight += clinicStampLines.length * 5;

    doc.setFontSize(12);
    doc.text("Nr. REGON: " + formData.regon, 140, yRight);
    doc.line(140, yRight + 5, 190, yRight + 5);

    // Tabela z badaniami
    const tableStartY = Math.max(yLeft, yRight + 20);

    autoTable(doc, {
      startY: tableStartY,
      head: [
        [
          "Data",
          "Wzrost",
          "Waga",
          "Wynik badania",
          "Pieczatka i podpis",
          "Data nastepnego badania",
        ],
      ],
      body: examinations.map((exam) => [
        exam.date,
        exam.height,
        exam.weight,
        exam.result,
        "",
        exam.nextDate,
      ]),
      styles: {
        fontSize: 11,
        cellPadding: 6,
        halign: "center",
        valign: "middle",
        font: "arial",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      didDrawCell: (data) => {
        const colIndex = data.column.index;
        const rowIndex = data.row.index;
        const cell = data.cell;

        // Dodaj obrazek tylko w kolumnie "Pieczątka i podpis" (index 4)
        if (colIndex === 4 && data.section === "body") {
          const exam = examinations[rowIndex];
          const image = exam.examinationStampImage;

          if (image) {
            try {
              const imageType = image.startsWith("data:image/jpeg")
                ? "JPEG"
                : "PNG";

              const imgWidth = 36;
              const imgHeight = 16;

              const x = cell.x + (cell.width - imgWidth) / 2;
              const y = cell.y + (cell.height - imgHeight) / 2;

              doc.addImage(image, imageType, x, y, imgWidth, imgHeight);
            } catch (error) {
              console.error("Błąd dodawania pieczątki do PDF:", error);
            }
          }
        }

        // Dodaj pionowe linie dla każdej komórki
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // lewa linia
        doc.line(
          cell.x + cell.width,
          cell.y,
          cell.x + cell.width,
          cell.y + cell.height
        ); // prawa linia
      },
    });

    doc.save("karta-zdrowia-sportowca.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
    >
      Pobierz PDF
    </button>
  );
}
