import clsx from "clsx";

interface TypographyProps {
  className?: string;
  children?: React.ReactNode;
}

export function TypographyH1({ className, children }: TypographyProps) {
  const style = `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${
    className ?? ""
  }`;
  return <h1 className={style}>{children}</h1>;
}

export function TypographyH2({ className, children }: TypographyProps) {
  const style = `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${
    className ?? ""
  }`;

  return <h2 className={style}>{children}</h2>;
}

export function TypographyH3({ children, className }: TypographyProps) {
  const style = `scroll-m-20 text-2xl font-semibold tracking-tight ${
    className ?? ""
  }`;

  return <h3 className={style}>{children}</h3>;
}

export function TypographyH4({ children, className }: TypographyProps) {
  const style = `scroll-m-20 text-xl font-semibold tracking-tight ${
    className ?? ""
  }`;

  return <h4 className={style}>{children}</h4>;
}

export function TypographyP({ children, className }: TypographyProps) {
  const style = `leading-7 [&:not(:first-child)]:mt-6 ${className ?? ""}`;

  return <p className={style}>{children}</p>;
}

export function TypographyLarge({ children, className }: TypographyProps) {
  const style = `text-lg font-semibold ${className ?? ""}`;

  return <p className={style}>{children}</p>;
}

export function TypographySmall({ children, className }: TypographyProps) {
  const style = `text-sm font-medium leading-none ${className ?? ""} `;

  return <small className={style}>{children}</small>;
}

export function TypographyMuted({ children, className }: TypographyProps) {
  const style = clsx("text-sm text-muted-foreground", className);

  return <p className={style}>{children}</p>;
}
