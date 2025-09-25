export default function Input(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 " +
        (props.className ?? "")
      }
    />
  );
}