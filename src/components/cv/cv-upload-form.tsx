import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FilePlus } from "lucide-react";
import { useUploadCV } from "@/hooks/api/use-base-cvs";


const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function CVUploadForm() {
  const upload = useUploadCV();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setFile(selected);
    if (!name) {
      setName(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) {
      setError("Please select a file and enter a name");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name.trim());
    formData.append("isDefault", String(isDefault));

    upload.mutate(formData, {
      onSuccess: () => {
        setName("");
        setFile(null);
        setIsDefault(false);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>CV Name</Label>
        <Input
          placeholder="e.g. Software Engineer CV"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={upload.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label>File</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
          disabled={upload.isPending}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#d9d9d9] p-6 text-sm text-[#353535]/60 transition-colors hover:border-[#3c6e71] hover:text-[#3c6e71] dark:border-[#353535] dark:text-[#d9d9d9]/60 dark:hover:border-[#3c6e71] dark:hover:text-[#3c6e71]"
        >
          {file ? (
            <>
              <FilePlus className="h-4 w-4" />
              {file.name}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Click to upload PDF or DOCX
            </>
          )}
        </button>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="h-4 w-4 accent-[#3c6e71]"
          disabled={upload.isPending}
        />
        <span className="text-sm text-[#353535] dark:text-[#d9d9d9]">
          Set as default CV
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
        disabled={upload.isPending || !file}
      >
        {upload.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {upload.isPending ? "Uploading..." : "Upload CV"}
      </Button>
    </form>
  );
}