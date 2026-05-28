import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PDF {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  teacher: string;
  uploadedAt: string;
  downloadCount: number;
  category?: string;
}

interface PDFContextType {
  pdfs: PDF[];
  addPDF: (pdf: Omit<PDF, "id" | "uploadedAt" | "downloadCount">) => Promise<void>;
  deletePDF: (id: string) => Promise<void>;
  incrementDownloadCount: (id: string) => Promise<void>;
  loadPDFs: () => Promise<void>;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

const PDFS_STORAGE_KEY = "app_pdfs";

export function PDFProvider({ children }: { children: React.ReactNode }) {
  const [pdfs, setPDFs] = useState<PDF[]>([]);

  // Load PDFs from storage on initialization
  const loadPDFs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PDFS_STORAGE_KEY);
      if (stored) {
        setPDFs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load PDFs:", error);
    }
  }, []);

  // Save PDFs to storage
  const savePDFs = useCallback(async (updatedPDFs: PDF[]) => {
    try {
      await AsyncStorage.setItem(PDFS_STORAGE_KEY, JSON.stringify(updatedPDFs));
      setPDFs(updatedPDFs);
    } catch (error) {
      console.error("Failed to save PDFs:", error);
      throw error;
    }
  }, []);

  const addPDF = useCallback(
    async (pdfData: Omit<PDF, "id" | "uploadedAt" | "downloadCount">) => {
      const newPDF: PDF = {
        ...pdfData,
        id: Date.now().toString(),
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
      };
      const updated = [...pdfs, newPDF];
      await savePDFs(updated);
    },
    [pdfs, savePDFs]
  );

  const deletePDF = useCallback(
    async (id: string) => {
      const updated = pdfs.filter((pdf) => pdf.id !== id);
      await savePDFs(updated);
    },
    [pdfs, savePDFs]
  );

  const incrementDownloadCount = useCallback(
    async (id: string) => {
      const updated = pdfs.map((pdf) =>
        pdf.id === id ? { ...pdf, downloadCount: pdf.downloadCount + 1 } : pdf
      );
      await savePDFs(updated);
    },
    [pdfs, savePDFs]
  );

  return (
    <PDFContext.Provider value={{ pdfs, addPDF, deletePDF, incrementDownloadCount, loadPDFs }}>
      {children}
    </PDFContext.Provider>
  );
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error("usePDF must be used within a PDFProvider");
  }
  return context;
}
