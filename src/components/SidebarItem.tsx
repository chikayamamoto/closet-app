import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

export function SidebarItem({ href, icon: Icon, label }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="
          flex h-11 items-center gap-3
          rounded-md px-8
          hover:bg-(--hover-light)
          transition-colors
        "
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </li>
  );
}
