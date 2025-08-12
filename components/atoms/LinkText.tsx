import Link from "next/link";

export const LinkText = ({ href, text }: { href: string; text: string }) => (
  <Link href={href} className="text-orange-500 hover:underline">
    {text}
  </Link>
);