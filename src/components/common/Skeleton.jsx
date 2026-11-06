export default function Skeleton({ className = '', count = 1 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[var(--bg-elevated)] rounded-xl ${className}`}
        />
      ))}
    </>
  );
}

