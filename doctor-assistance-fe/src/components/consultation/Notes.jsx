import React, { useState, useEffect } from "react";
import { IoCopyOutline, IoCopy } from "react-icons/io5";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { handleDownloadPDF } from "@/utils/pdf";

const subsectionsMapping = {
  cc: "Chief Complaint: ",
  hpi: "History of Present Illness: ",
  ros: "Review of Systems: ",
  other_histories: "Other Histories: ",
  pe: "Physical Exam: ",
  vitals: "Vitals Reviewed: ",
  findings: "Findings: ",
  assessment: "Assessment: ",
  plan: "Plan: ",
  ap: "Assessment & Plan: ",
  instructions: "Instructions: ",
};

export default function Notes({ notes }) {
  let parsedNotes = {};

  try {
    // Check if notes is a valid JSON string, otherwise fall back to an empty object
    parsedNotes = typeof notes === "string" ? JSON.parse(notes) : notes;
  } catch (error) {
    console.error("Error parsing notes:", error);
    parsedNotes = {};
  }

  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState(parsedNotes);

  // Auto-resize textarea
  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => autoResize(textarea));

    const handleResize = () => {
      textareas.forEach((textarea) => autoResize(textarea));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [formData]);

  // Copy formatted text to clipboard
  const handleCopy = () => {
    const textToCopy = Object.entries(formData)
      .map(([key, value]) => {
        const label = subsectionsMapping[key] || key;
        return `${label} ${value}`;
      })
      .join("\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="h-[76vh]">
      <div id="notes-content" className="h-[67vh] mb-5 overflow-y-scroll">
        {Object.keys(formData).map((key) => (
          <div key={key} className="mb-4">
            <Label htmlFor={key} className="text-primary">
              {subsectionsMapping[key] || key}
            </Label>
            <textarea
              name={key}
              id={key}
              value={formData[key] || ""}
              onChange={handleInputChange}
              placeholder={`Enter ${subsectionsMapping[key] || key}...`}
              rows={1}
              className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() =>
            handleDownloadPDF("notes-content", "patient-notes.pdf")
          }
        >
          Download PDF
        </Button>
        <Button onClick={handleCopy} variant="outline">
          {isCopied ? <IoCopy /> : <IoCopyOutline />}
        </Button>
      </div>
    </div>
  );
}
