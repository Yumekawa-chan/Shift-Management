import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        className="w-full px-3 py-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2 border rounded"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

export default FormInput;
