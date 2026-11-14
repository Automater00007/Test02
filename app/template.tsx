/**
 * Re-mounts on every navigation, which gives each page a short entrance beat.
 * Kept to opacity + a small translate so it stays compositor-only; the final
 * keyframe resets the transform so no containing block is left behind for
 * sticky/fixed children.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
