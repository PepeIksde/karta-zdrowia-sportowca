"use client";

import HealthCardPDF from "@/components/health-card-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

interface ExaminationRecord {
  date: string;
  height: string;
  weight: string;
  result: string;
  stamp: string;
  nextDate: string;
  examinationStampImage: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    birthDate: "",
    pesel: "",
    organization: "",
    registrationNumber: "",
    clinicStamp: "",
    regon: "",
    clinicStampImage: "",
    examinationStampImage: "",
  });

  const [examinations, setExaminations] = useState<ExaminationRecord[]>([
    {
      date: "",
      height: "",
      weight: "",
      result: "",
      stamp: "",
      nextDate: "",
      examinationStampImage: "",
    },
  ]);

  const clinicStampInputRef = useRef<HTMLInputElement | null>(null);
  const examinationStampRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExaminationChange = (
    index: number,
    field: keyof ExaminationRecord,
    value: string
  ) => {
    setExaminations((prev) => {
      const newExaminations = [...prev];
      newExaminations[index] = {
        ...newExaminations[index],
        [field]: value,
      };
      return newExaminations;
    });
  };

  const addExamination = () => {
    setExaminations((prev) => [
      ...prev,
      {
        date: "",
        height: "",
        weight: "",
        result: "",
        stamp: "",
        nextDate: "",
        examinationStampImage: "",
      },
    ]);
  };

  const removeExamination = (index: number) => {
    setExaminations((prev) => prev.filter((_, i) => i !== index));
    examinationStampRefs.current.splice(index, 1); // usuń ref z listy
  };

  const clearForm = () => {
    if (confirm("Czy na pewno chcesz wyczyścić cały formularz?")) {
      setFormData({
        name: "",
        firstName: "",
        birthDate: "",
        pesel: "",
        organization: "",
        registrationNumber: "",
        clinicStamp: "",
        regon: "",
        clinicStampImage: "",
        examinationStampImage: "",
      });

      setExaminations([
        {
          date: "",
          height: "",
          weight: "",
          result: "",
          stamp: "",
          nextDate: "",
          examinationStampImage: "",
        },
      ]);

      // Czyść inputy file
      if (clinicStampInputRef.current) {
        clinicStampInputRef.current.value = "";
      }

      examinationStampRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });

      // Reset refs do jednego pustego badania
      examinationStampRefs.current = [null];
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Karta Zdrowia Sportowca
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Personal Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Dane osobowe
            </h2>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  Imię/Imiona
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nazwisko
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthDate" className="text-gray-700">
                  Data urodzenia
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pesel" className="text-gray-700">
                  PESEL
                </Label>
                <Input
                  id="pesel"
                  name="pesel"
                  value={formData.pesel}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Dane organizacyjne
            </h2>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organization" className="text-gray-700">
                  Organizacja sportowa
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationNumber" className="text-gray-700">
                  Numer rejestru
                </Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="regon" className="text-gray-700">
                  Nr REGON
                </Label>
                <Input
                  id="regon"
                  name="regon"
                  value={formData.regon}
                  onChange={handleInputChange}
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Zdjęcie pieczątki (png/jpg)
            </h2>
            <Input
              type="file"
              accept="image/*"
              ref={clinicStampInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      clinicStampImage: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right column - Examinations */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Badania</h2>
            <Button
              onClick={addExamination}
              className="bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Dodaj badanie
            </Button>
          </div>

          <div className="space-y-6">
            {examinations.map((examination, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Data badania</Label>
                    <Input
                      type="date"
                      value={examination.date}
                      onChange={(e) =>
                        handleExaminationChange(index, "date", e.target.value)
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Wzrost</Label>
                    <Input
                      type="text"
                      value={examination.height}
                      onChange={(e) =>
                        handleExaminationChange(index, "height", e.target.value)
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Waga</Label>
                    <Input
                      type="text"
                      value={examination.weight}
                      onChange={(e) =>
                        handleExaminationChange(index, "weight", e.target.value)
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Wynik badania</Label>
                    <Input
                      type="text"
                      value={examination.result}
                      onChange={(e) =>
                        handleExaminationChange(index, "result", e.target.value)
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Pieczątka i podpis</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        examinationStampRefs.current[index] = el;
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setExaminations((prev) => {
                              const updated = [...prev];
                              updated[index] = {
                                ...updated[index],
                                examinationStampImage: reader.result as string,
                              };
                              return updated;
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">
                      Data następnego badania
                    </Label>
                    <Input
                      type="date"
                      value={examination.nextDate}
                      onChange={(e) =>
                        handleExaminationChange(
                          index,
                          "nextDate",
                          e.target.value
                        )
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {examinations.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeExamination(index)}
                    className="mt-4 bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Usuń badanie
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDF + Clear Form Button */}
      <div className="mt-12 space-y-4">
        <HealthCardPDF formData={formData} examinations={examinations} />
        <Button
          variant="outline"
          onClick={clearForm}
          className="px-5 py-5 w-full border-red-500 text-red-600 hover:bg-red-50"
        >
          Wyczyść formularz
        </Button>
      </div>
    </div>
  );
}
