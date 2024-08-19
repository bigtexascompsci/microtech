"use client";

import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

import { ScrollArea } from "@/components/ui/scroll-area";

// Import styles for annotations and text layer
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Document {
  id: number;
  folder_id: number;
  name: string;
  type: string;
  created_at: Date;
  key: string;
  url: string;
}

async function fetchDocument(documentId: number) {
  const response = await fetch("http://localhost:3000/api/getDocument", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentId: documentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document");
  }

  const data = await response.json();
  return Array.isArray(data.result) ? data.result[0] : data.result;
}

export function PDFViewer({ documentId }: { documentId: number }) {
  const [numPages, setNumPages] = useState<number>();
  const [document, setDocument] = useState<Document | undefined>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const fetchedDocument = await fetchDocument(documentId);

        if (
          fetchedDocument &&
          typeof fetchedDocument === "object" &&
          !Array.isArray(fetchedDocument)
        ) {
          setDocument(fetchedDocument);
        }
      } catch (error) {
        console.error("Failed to fetch document", error);
      }
    };
    loadDocuments();
  }, [documentId]);

  return (
    <ScrollArea className="bg-secondary h-screen">
      <div className="flex justify-center items-center p-8">
        {document ? (
          <div className="flex flex-col items-center w-full max-w-3xl">
            <Document
              file={document.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error("Error loading PDF:", error)
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="mb-4">
                  <Page
                    pageNumber={index + 1}
                    scale={1.5}
                    renderTextLayer={false} // Disable text layer rendering
                    renderAnnotationLayer={true} // Enable annotation layer rendering
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : (
          <p>Loading document...</p>
        )}
      </div>
    </ScrollArea>
  );
}
