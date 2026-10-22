import Link from "next/link";

interface ClothesButtonProps {
  href: string;
  label: string;
  selected?: boolean;
}

export function ClothesButton({ href, label, selected }: ClothesButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center
        px-4 py-2 rounded-full text-sm transition-colors
        ${selected
          ? "bg-(--color-primary) text-(--text-main)"
          : "bg-transparent text-(--text-sub) hover:bg-(--hover-light)"}
      `}
    >
      {label}
    </Link>
  );
}
