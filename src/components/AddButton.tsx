
interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export default function AddButton({
  label,
  onClick,
}: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        rounded-full
        bg-(--color-primary)
        px-5 py-3
        text-(--text-main)
        transition-colors
        hover:bg-(--color-secondary)
      "
    >
      ＋ {label}
    </button>
  );
}
