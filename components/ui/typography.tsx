import clsx from "clsx";

interface TypographyProps {
  className?: string;
  children?: React.ReactNode;
}

export function TypographyH1({ className, children }: TypographyProps) {
  const cl = clsx(
    "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    className
  );
  return <h1 className={cl}>{children}</h1>;
}

export function TypographyH2({ className, children }: TypographyProps) {
  const cl = clsx(
    "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
    className
  );

  return <h2 className={cl}>{children}</h2>;
}

export function TypographyH3({ children, className }: TypographyProps) {
  const cl = clsx(
    "scroll-m-20 text-2xl font-semibold tracking-tight",
    className
  );

  return <h3 className={cl}>{children}</h3>;
}

export function TypographyH4({ children, className }: TypographyProps) {
  const cl = clsx(
    "scroll-m-20 text-xl font-semibold tracking-tight ",
    className
  );

  return <h4 className={cl}>{children}</h4>;
}

export function TypographyP({ children, className }: TypographyProps) {
  const cl = clsx("leading-7 [&:not(:first-child)]:mt-6", className);

  return <p className={cl}>{children}</p>;
}

export function TypographyLarge({ children, className }: TypographyProps) {
  const cl = clsx("text-lg font-semibold", className);

  return <p className={cl}>{children}</p>;
}

export function TypographySmall({ children, className }: TypographyProps) {
  const cl = clsx("text-sm font-medium leading-none", className);

  return <small className={cl}>{children}</small>;
}

export function TypographyMuted({ children, className }: TypographyProps) {
  const cl = clsx("text-sm text-muted-foreground", className);

  return <p className={cl}>{children}</p>;
}
