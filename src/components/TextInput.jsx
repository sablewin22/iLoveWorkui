export default function TextInput({ value, onChange, placeholder, maxLength = 10000 }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) onChange(e.target.value);
        }}
        placeholder={placeholder}
        rows={6}
        className="input-field resize-y min-h-[140px]"
        aria-label="Texto de entrada"
      />
      <span className="absolute bottom-3 right-3 text-xs text-light/30">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
