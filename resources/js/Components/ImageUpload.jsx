import React, {useEffect, useRef, useState} from 'react';
// Removed useForm, PrimaryButton, InputError as these will be handled by the parent form

export default function ImageUpload({value, onChange, name, error}) {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const fileInputRef = useRef(null); // Create a ref for the file input

    // Effect to update preview when the value prop changes (e.g., when a file is selected or cleared)
    useEffect(() => {
        if (value instanceof File) {
            setImagePreviewUrl(URL.createObjectURL(value));
        } else {
            setImagePreviewUrl(null);
            // Manually clear the file input if value is null (e.g., after successful upload)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the selected file
            }
        }
        // Clean up the object URL when the component unmounts or value changes
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [value]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Pass the file up to the parent component via the onChange prop
        // Added a check to ensure 'file' is a valid File object before passing
        if (file instanceof File) {
            onChange(file);
        } else {
            // If no file is selected or something unexpected, pass null
            onChange(null);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    Select Image
                </label>
                <input
                    id={name}
                    type="file"
                    name={name}
                    onChange={handleFileChange}
                    ref={fileInputRef} // Attach the ref
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
            </div>

            {imagePreviewUrl && (
                <div className="mt-4">
                    <p className="block text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
                    <img
                        src={imagePreviewUrl}
                        alt="Image Preview"
                        className="max-w-full h-auto rounded-md border border-gray-300 shadow-sm object-cover"
                        style={{maxHeight: '200px'}}
                    />
                </div>
            )}
        </div>
    );
}

