import Link from "next/link";
import React from "react";

const DropdownLink = React.forwardRef(({ href, children, ...rest }:any, ref: React.LegacyRef<HTMLInputElement>) => {
  return (
    <Link href={href} passHref {...rest}>
      {children}
    </Link>
  );
});

export default DropdownLink;
