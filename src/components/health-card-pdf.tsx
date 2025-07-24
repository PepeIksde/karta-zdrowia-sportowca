"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "./ui/button";

interface ExaminationRecord {
  date: string;
  height: string;
  weight: string;
  result: string;
  stamp: string;
  nextDate: string;
}

interface HealthCardPDFProps {
  formData: {
    name: string;
    firstName: string;
    birthDate: string;
    pesel: string;
    organization: string;
    registrationNumber: string;
    instructorNotes: string;
    instructorRecommendations: string;
    clinicStamp: string;
    regon: string;
  };
  examinations: ExaminationRecord[];
}

export default function HealthCardPDF({
  formData,
  examinations,
}: HealthCardPDFProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");

    // STRONA 1
    doc.setFontSize(20);
    doc.text("KARTA", 105, 25, { align: "center" });
    doc.text("ZDROWIA SPORTOWCA", 105, 35, { align: "center" });

    doc.setFontSize(12);

    // Dane osobowe – lewa kolumna
    const leftLabels = [
      "Nazwisko:",
      "Imie/Imiona:",
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
      formData.organization,
      formData.registrationNumber,
    ];

    let yLeft = 50;
    const maxWidth = 170; // szerokość dla tekstów (20 do 190 mm)
    const lineSpacing = 18; // odstęp między liniami

    for (let i = 0; i < leftLabels.length; i++) {
      if (leftLabels[i] === "Organizacja sportowa:") {
        // Zawijamy tekst "Organizacja sportowa" wraz z etykietą
        const orgText = `${leftLabels[i]} ${leftValues[i]}`;
        const orgLines = doc.splitTextToSize(orgText, maxWidth);
        doc.text(orgLines, 20, yLeft);
        // Rysujemy linię pod ostatnią linijką tekstu z 5 mm odstępu od tekstu
        doc.line(
          20,
          yLeft + 5 + (orgLines.length - 1) * 7,
          190,
          yLeft + 5 + (orgLines.length - 1) * 7
        );
        // Przesuwamy yLeft o wysokość wszystkich linii + odstęp
        yLeft += orgLines.length * 7 + 10;
      } else {
        // Zwykły wiersz z tekstem i linią
        doc.text(`${leftLabels[i]} ${leftValues[i]}`, 20, yLeft);
        doc.line(20, yLeft + 5, 110, yLeft + 5);
        yLeft += lineSpacing;
      }
    }

    // Prawa kolumna: pieczątka poradni i Nr REGON
    let yRight = 70;
    doc.setFontSize(10);
    doc.text("(pieczatka poradni)", 140, yRight);

    const clinicStampLines = doc.splitTextToSize(
      formData.clinicStamp || "",
      50
    );
    yRight += 8;
    doc.setFontSize(11);
    doc.text(clinicStampLines, 140, yRight);

    yRight += clinicStampLines.length * 5;
    doc.setFontSize(12);
    doc.text("Nr. REGON: " + formData.regon, 140, yRight);
    doc.line(140, yRight + 5, 190, yRight + 5);

    // Sekcja "Uwagi instruktora"
    // Ustawiamy y poniżej większej wartości między yLeft a yRight + odstęp 20
    let y = Math.max(yLeft, yRight + 20);
    doc.setFontSize(12);
    doc.text("Uwagi instruktora:", 20, y);

    const notesLines = doc.splitTextToSize(
      formData.instructorNotes || "",
      maxWidth
    );
    const maxNotesLines = 5;
    const displayedNotes = notesLines.slice(0, maxNotesLines);
    if (notesLines.length > maxNotesLines) {
      displayedNotes[maxNotesLines - 1] += " ...";
    }

    const lineHeight = 8;
    // Rysujemy linie i tekst uwag
    for (let i = 0; i < maxNotesLines; i++) {
      const lineY = y + 10 + i * lineHeight;
      doc.line(20, lineY, 190, lineY); // linia
    }
    doc.setFontSize(10);
    displayedNotes.forEach((line: string, idx: number) => {
      // tekst 2 mm nad linią
      const textY = y + 10 + idx * lineHeight - 2;
      doc.text(line, 22, textY);
    });

    // Sekcja "Wskazówki dla instruktora"
    y += maxNotesLines * lineHeight + 25;
    doc.setFontSize(12);
    doc.text("Wskazówki dla instruktora:", 20, y);

    const recLines = doc.splitTextToSize(
      formData.instructorRecommendations || "",
      maxWidth
    );
    const maxRecLines = 5;
    const displayedRec = recLines.slice(0, maxRecLines);
    if (recLines.length > maxRecLines) {
      displayedRec[maxRecLines - 1] += " ...";
    }

    for (let i = 0; i < maxRecLines; i++) {
      const lineY = y + 10 + i * lineHeight;
      doc.line(20, lineY, 190, lineY); // linia
    }
    doc.setFontSize(10);
    displayedRec.forEach((line: string, idx: number) => {
      const textY = y + 10 + idx * lineHeight - 2;
      doc.text(line, 22, textY);
    });

    // STRONA 2 – tabela badań
    doc.addPage();
    autoTable(doc, {
      startY: 20,
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
        exam.stamp,
        exam.nextDate,
      ]),
      styles: {
        fontSize: 11,
        cellPadding: 6,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.5,
    });

    doc.save("karta-zdrowia-sportowca.pdf");
  };

  return (
    <Button onClick={generatePDF} className="mt-4  bg-amber-500">
      Generuj PDF
    </Button>
  );
}
