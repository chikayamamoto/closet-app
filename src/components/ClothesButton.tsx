
interface ClothesButtonProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export function ClothesButton({
  label,
  selected = false,
  onClick,
}: ClothesButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 rounded-full text-sm transition-colors
        ${selected
          ? "bg-(--hover-light) text-(--text-main)"
          : "bg-transparent text-(--text-sub) hover:bg-(--hover-light)"
        }
      `}
    >
      {label}
    </button>
  );
}
