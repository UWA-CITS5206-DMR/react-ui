import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface PageRangeInputProps {
  onConfirm: (pageRange: string) => void;
  onCancel: () => void;
  fileName?: string;
}

export default function PageRangeInput({ onConfirm, onCancel, fileName }: PageRangeInputProps) {
  const [pageRange, setPageRange] = useState("");
  const [error, setError] = useState("");
  const [previewEntireFile, setPreviewEntireFile] = useState(false);

  const validatePageRange = (value: string): boolean => {
    if (!value.trim()) {
      setError("Please enter a page range");
      return false;
    }

    // Format: single page (e.g., "5") or ranges (e.g., "1-7,8-9,15")
    const pattern = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    if (!pattern.test(value.trim())) {
      setError("Invalid page range format. Correct format: 1-7,8-9 or single page like 5");
      return false;
    }

    // Validate that ranges are logical (start <= end)
    const ranges = value.split(",");
    for (const range of ranges) {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        if (start > end) {
          setError(`Invalid range ${range}: start page cannot be greater than end page`);
          return false;
        }
      }
    }

    setError("");
    return true;
  };

  const handleConfirm = () => {
    if (previewEntireFile) {
      onConfirm(""); // Empty string indicates entire file
    } else if (validatePageRange(pageRange)) {
      onConfirm(pageRange.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div className="space-y-4">
      {fileName && (
        <div className="text-sm text-muted-foreground">
          Previewing: <span className="font-medium">{fileName}</span>
        </div>
      )}
      {/* Toggle for previewing entire file */}
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Switch
          id="preview-entire-file"
          checked={previewEntireFile}
          onCheckedChange={setPreviewEntireFile}
        />
        <Label htmlFor="preview-entire-file" className="text-sm font-medium cursor-pointer">
          Preview entire file (recommended)
        </Label>
      </div>

      {!previewEntireFile && (
        <>
          <div className="space-y-2">
            <Label htmlFor="pageRange">Specify Page Range</Label>
            <Input
              id="pageRange"
              type="text"
              placeholder="e.g., 1-7,8-9 or 5"
              value={pageRange}
              onChange={(e) => {
                setPageRange(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className={
                error ? "border-red-500 focus-visible:ring-offset-0" : "focus-visible:ring-offset-0"
              }
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Page Range Format:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>
                  Single page: <code className="bg-gray-100 px-1 rounded">5</code>
                </li>
                <li>
                  Range: <code className="bg-gray-100 px-1 rounded">1-7</code>
                </li>
                <li>
                  Multiple: <code className="bg-gray-100 px-1 rounded">1-7,8-9,15</code>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </>
      )}

      {previewEntireFile && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            The entire file will be previewed. This is the recommended option for most cases.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm Preview</Button>
      </div>
    </div>
  );
}
