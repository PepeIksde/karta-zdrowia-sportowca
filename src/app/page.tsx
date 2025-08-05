"use client";

import HealthCardPDF from "@/components/health-card-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ExaminationRecord {
  date: string;
  height: string;
  weight: string;
  result: string;
  nextDate: string;
  examinationStampImage: string;
}

interface AthleteCard {
  formData: {
    name: string;
    firstName: string;
    birthDate: string;
    pesel: string;
    organization: string;
    registrationNumber: string;
    clinicStamp: string;
    clinicStampImage: string;
  };
  examinations: ExaminationRecord[];
}

export default function Home() {
  const [athletes, setAthletes] = useState<AthleteCard[]>([getEmptyAthlete()]);

  function getEmptyAthlete(): AthleteCard {
    return {
      formData: {
        name: "",
        firstName: "",
        birthDate: "",
        pesel: "",
        organization: "",
        registrationNumber: "",
        clinicStamp: "",
        clinicStampImage: "",
      },
      examinations: [
        {
          date: "",
          height: "",
          weight: "",
          result: "",
          nextDate: "",
          examinationStampImage: "",
        },
      ],
    };
  }

  const addAthlete = () => {
    setAthletes((prev) => [...prev, getEmptyAthlete()]);
  };

  const removeAthlete = (index: number) => {
    if (confirm("Czy na pewno chcesz usunąć tego sportowca?")) {
      setAthletes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const clearAthlete = (index: number) => {
    if (confirm("Czy na pewno chcesz wyczyścić dane tego sportowca?")) {
      setAthletes((prev) => {
        const updated = [...prev];
        updated[index] = getEmptyAthlete();
        return updated;
      });
    }
  };

  const handleAthleteChange = (
    athleteIndex: number,
    field: keyof AthleteCard["formData"],
    value: string
  ) => {
    const updated = [...athletes];
    updated[athleteIndex].formData[field] = value;
    setAthletes(updated);
  };

  const handleExaminationChange = (
    athleteIndex: number,
    examIndex: number,
    field: keyof ExaminationRecord,
    value: string
  ) => {
    const updated = [...athletes];
    updated[athleteIndex].examinations[examIndex][field] = value;
    setAthletes(updated);
  };

  const addExamination = (athleteIndex: number) => {
    const updated = [...athletes];
    updated[athleteIndex].examinations.push({
      date: "",
      height: "",
      weight: "",
      result: "",
      nextDate: "",
      examinationStampImage: "",
    });
    setAthletes(updated);
  };

  const removeExamination = (athleteIndex: number, examIndex: number) => {
    const updated = [...athletes];
    updated[athleteIndex].examinations = updated[
      athleteIndex
    ].examinations.filter((_, i) => i !== examIndex);
    setAthletes(updated);
  };

  const handleClinicStampUpload = (athleteIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...athletes];
      updated[athleteIndex].formData.clinicStampImage = reader.result as string;
      setAthletes(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (
    athleteIndex: number,
    examIndex: number,
    file: File
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...athletes];
      updated[athleteIndex].examinations[examIndex].examinationStampImage =
        reader.result as string;
      setAthletes(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="container mx-auto p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Karta Zdrowia Sportowca
      </h1>

      {athletes.map((athlete, athleteIndex) => (
        <div key={athleteIndex} className="space-y-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      value={athlete.formData.firstName}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "firstName",
                          e.target.value
                        )
                      }
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Nazwisko
                    </Label>
                    <Input
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                      value={athlete.formData.name}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-700">
                      Data urodzenia
                    </Label>
                    <Input
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                      type="date"
                      value={athlete.formData.birthDate}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "birthDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-700">
                      PESEL
                    </Label>
                    <Input
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                      value={athlete.formData.pesel}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "pesel",
                          e.target.value
                        )
                      }
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
                    <Label className="text-gray-700">
                      Organizacja sportowa
                    </Label>
                    <Input
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                      value={athlete.formData.organization}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "organization",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-700">Numer rejestru</Label>
                    <Input
                      className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                      value={athlete.formData.registrationNumber}
                      onChange={(e) =>
                        handleAthleteChange(
                          athleteIndex,
                          "registrationNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2 bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Zdjęcie pieczątki (png/jpg)
                </h2>
                <Input
                  className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    handleClinicStampUpload(athleteIndex, e.target.files[0])
                  }
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Badania
                </h2>
                {/* <Button
                  onClick={() => addExamination(athleteIndex)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Dodaj badanie
                </Button> */}
              </div>
              <div className="space-y-6">
                {athlete.examinations.map((exam, examIndex) => (
                  <div
                    key={examIndex}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 pb-2">
                          Data badania
                        </Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          type="date"
                          value={exam.date}
                          onChange={(e) =>
                            handleExaminationChange(
                              athleteIndex,
                              examIndex,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 pb-2">Wzrost</Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          value={exam.height}
                          onChange={(e) =>
                            handleExaminationChange(
                              athleteIndex,
                              examIndex,
                              "height",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 pb-2">Waga</Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          value={exam.weight}
                          onChange={(e) =>
                            handleExaminationChange(
                              athleteIndex,
                              examIndex,
                              "weight",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 pb-2">
                          Wynik badania
                        </Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          value={exam.result}
                          onChange={(e) =>
                            handleExaminationChange(
                              athleteIndex,
                              examIndex,
                              "result",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 pb-2">
                          Data następnego badania
                        </Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          type="date"
                          value={exam.nextDate}
                          onChange={(e) =>
                            handleExaminationChange(
                              athleteIndex,
                              examIndex,
                              "nextDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 pb-2">
                          Pieczątka i podpis
                        </Label>
                        <Input
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            handleStampUpload(
                              athleteIndex,
                              examIndex,
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </div>
                    {athlete.examinations.length > 1 && (
                      <Button
                        variant="destructive"
                        onClick={() =>
                          removeExamination(athleteIndex, examIndex)
                        }
                        className="mt-4 bg-red-500 hover:bg-red-600"
                      >
                        Usuń badanie
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => clearAthlete(athleteIndex)}
              className="w-full border-red-500 text-red-600 hover:bg-red-50 mb-4"
            >
              Wyczyść dane sportowca
            </Button>
            <Button
              variant="outline"
              onClick={() => removeAthlete(athleteIndex)}
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
            >
              Usuń sportowca
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-12 space-y-4">
        <Button
          onClick={addAthlete}
          className="px-5 py-6 w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Dodaj sportowca
        </Button>
        <HealthCardPDF cards={athletes} />
      </div>
    </main>
  );
}
