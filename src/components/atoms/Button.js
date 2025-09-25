export default function Button(props) {
  const { variant = "solid", className, ...rest } = props;
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm";
  const styles =
    variant === "ghost"
      ? "hover:bg-slate-100 dark:hover:bg-slate-800"
      : variant === "outline"
      ? "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      : "bg-emerald-600 text-white hover:bg-emerald-700";
  return (
    <button {...rest} className={`${base} ${styles} ${className ?? ""}`} />
  );
}
