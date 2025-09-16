"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

interface CsvUploaderProps {
  onUploadComplete?: (data: any[]) => void;
}

export default function CsvUploader({ onUploadComplete }: CsvUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      parseCsv(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    multiple: false,
  });

  const parseCsv = (file: File) => {
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error("Error parsing CSV file");
          console.error("CSV parsing errors:", results.errors);
        } else {
          setPreviewData(results.data.slice(0, 20)); // Show first 20 rows
          toast.success("CSV file parsed successfully");
        }
        setIsUploading(false);
      },
      error: (error) => {
        toast.error("Error reading CSV file");
        console.error("CSV reading error:", error);
        setIsUploading(false);
      },
    });
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      toast.success("File uploaded successfully");
      onUploadComplete?.(result);
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewData([]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Campaign Data</h3>
      
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? "Drop the CSV file here" : "Drag & drop your CSV file"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse files
          </p>
          <p className="text-xs text-gray-400">
            Supports Google Ads and Meta Ads CSV exports
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{uploadedFile.name}</p>
                <p className="text-sm text-green-700">
                  {previewData.length} rows previewed
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {previewData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Data Preview</h4>
              <div className="max-h-60 overflow-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {String(value).substring(0, 50)}
                            {String(value).length > 50 && "..."}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isUploading ? "Uploading..." : "Upload to Database"}
          </button>
        </div>
      )}
    </div>
  );
}
