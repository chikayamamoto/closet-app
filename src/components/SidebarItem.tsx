
import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

export function SidebarItem({
  href,
  icon: Icon,
  label,
  onClick,
}: SidebarItemProps) {
  const className = `
    flex h-11 w-full items-center gap-3
    rounded-md px-8
    text-left
    hover:bg-(--hover-light)
    transition-colors
  `;

  return (
    <li>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={className}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ) : (
        <Link href={href} className={className}>
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      )}
    </li>
  );
}
