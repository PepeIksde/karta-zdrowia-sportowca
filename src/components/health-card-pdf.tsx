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

interface HealthCardData {
  formData: {
    name: string;
    firstName: string;
    birthDate: string;
    pesel: string;
    organization: string;
    registrationNumber: string;
    clinicStamp: string;
    regon: string;
    clinicStampImage: string;
  };
  examinations: ExaminationRecord[];
}

interface HealthCardPDFProps {
  cards: HealthCardData[];
}

export default function HealthCardPDF({ cards }: HealthCardPDFProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("arial_geo-bold-italic.ttf", arialgeobold);
    doc.addFont("arial_geo-bold-italic.ttf", "arialGeoBoldItalic", "normal");
    doc.setFont("arialGeoBoldItalic");

    let yOffset = -10;

    cards.forEach((card, index) => {
      const { formData, examinations } = card;

      doc.setFontSize(16);
      doc.text("KARTA", 105, 20 + yOffset, { align: "center" });
      doc.text("ZDROWIA SPORTOWCA", 105, 30 + yOffset, { align: "center" });

      doc.setFontSize(10);

      // Lewa kolumna
      const leftLabels = [
        "Imię/Imiona:",
        "Nazwisko:",
        "Data urodzenia:",
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

      let yLeft = 40 + yOffset;
      const maxWidth = 150;
      const lineSpacing = 14;

      for (let i = 0; i < leftLabels.length; i++) {
        if (leftLabels[i] === "Organizacja sportowa:") {
          const orgText = `${leftLabels[i]} ${leftValues[i]}`;
          const orgLines = doc.splitTextToSize(orgText, maxWidth);
          doc.text(orgLines, 20, yLeft);
          doc.line(
            20,
            yLeft + 4 + (orgLines.length - 1) * 6,
            180,
            yLeft + 4 + (orgLines.length - 1) * 6
          );
          yLeft += orgLines.length * 6 + 8;
        } else {
          doc.text(`${leftLabels[i]} ${leftValues[i]}`, 20, yLeft);
          doc.line(20, yLeft + 4, 110, yLeft + 4);
          yLeft += lineSpacing;
        }
      }

      // Prawa kolumna
      let yRight = 55 + yOffset;

      if (formData.clinicStampImage) {
        const imageType = formData.clinicStampImage.startsWith(
          "data:image/jpeg"
        )
          ? "JPEG"
          : "PNG";
        doc.addImage(
          formData.clinicStampImage,
          imageType,
          140,
          yRight - 8,
          50,
          30
        );
        yRight += 24;
      }

      doc.setFontSize(8);
      doc.text("(pieczątka poradni)", 140, yRight);
      yRight += 8;

      const clinicStampLines = doc.splitTextToSize(
        formData.clinicStamp || "",
        50
      );
      doc.setFontSize(10);
      doc.text(clinicStampLines, 140, yRight);
      yRight += clinicStampLines.length * 5;

      doc.setFontSize(10);
      doc.text("Nr. REGON: " + formData.regon, 140, yRight);
      doc.line(140, yRight + 4, 190, yRight + 4);

      const tableStartY = Math.max(yLeft, yRight + 15);

      autoTable(doc, {
        startY: tableStartY,
        head: [
          [
            "Data badania",
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
          fontSize: 9,
          cellPadding: 4,
          halign: "center",
          valign: "middle",
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        didDrawCell: (data) => {
          const colIndex = data.column.index;
          const rowIndex = data.row.index;
          const cell = data.cell;

          if (colIndex === 4 && data.section === "body") {
            const exam = examinations[rowIndex];
            const image = exam.examinationStampImage;

            if (image) {
              try {
                const imageType = image.startsWith("data:image/jpeg")
                  ? "JPEG"
                  : "PNG";
                const imgWidth = 36.5;
                const imgHeight = 12;
                const x = cell.x + (cell.width - imgWidth) / 2;
                const y = cell.y + (cell.height - imgHeight) / 2;
                doc.addImage(image, imageType, x, y, imgWidth, imgHeight);
              } catch (error) {
                console.error("Błąd dodawania pieczątki do PDF:", error);
              }
            }
          }
        },
      });

      // Aktualizacja yOffset dla kolejnej karty

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yOffset = (doc as any).lastAutoTable.finalY - 2;

      // Jeśli przekracza wysokość strony – dodaj nową stronę
      if (yOffset > 260 && index < cards.length - 1) {
        doc.addPage();
        yOffset = 0;
      }
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
