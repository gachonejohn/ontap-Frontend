import Select from "react-select";
import { FiFileText } from "react-icons/fi";
import { GoTrash } from "react-icons/go";

const DOCUMENT_TYPE_OPTIONS = [
  { value: "National Id", label: "National ID" },
  { value: "Passport", label: "Passport" },
  { value: "Medical Certificate", label: "Medical Certificate" },
  { value: "Contract", label: "Employment Contract" },
  { value: "Academic  Certificate", label: "Academic  Certificate" },
  { value: "Other", label: "Other" },
];

const DocumentsTab = ({ documents, setDocuments }) => {
  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        document_type: "",
        file: null,
        description: "",
        expiry_date: "",
      },
    ]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const updateDocument = (index, field, value) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button
          type="button"
          onClick={addDocument}
          className="px-3 py-2 border bg-slate-100 rounded-md text-[12px]"
        >
          Add Document
        </button>
      </div>

      {documents.map((document, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <div className="flex justify-end gap-x-2 items-center mb-2">
            <GoTrash
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => removeDocument(index)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Document Type (React-Select) */}
            <div>
              <label className="block text-[12px] font-medium mb-1">
                Document Type*
              </label>
              <Select
                options={DOCUMENT_TYPE_OPTIONS}
                value={
                  document.document_type
                    ? DOCUMENT_TYPE_OPTIONS.find(
                        (opt) => opt.value === document.document_type
                      )
                    : null
                }
                onChange={(selected) =>
                  updateDocument(index, "document_type", selected?.value || "")
                }
                placeholder="Select type"
                menuPortalTarget={document.body}
          menuPlacement="auto"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base) => ({
              ...base,
              minHeight: "36px",
              borderColor: "#d1d5db",
              boxShadow: "none",
              "&:hover": { borderColor: "#9ca3af" },
              backgroundColor: "#F3F4F6",
            }),
          }}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[12px] font-medium mb-1">File</label>
              <input
                type="file"
                onChange={(e) =>
                  updateDocument(index, "file", e.target.files[0])
                }
                className="w-full py-2 px-3 text-[12px] rounded-md border bg-white focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-[12px] font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={document.expiry_date}
                onChange={(e) =>
                  updateDocument(index, "expiry_date", e.target.value)
                }
                className="w-full py-2 px-3 rounded-md text-[12px] border bg-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      ))}

      {documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FiFileText className="mx-auto mb-2" size={24} />
          <p>No documents added yet</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
