interface SectionDividerProps {
  fromColor: string;
  toColor: string;
  height?: string;
}

export function SectionDivider({ fromColor, toColor, height = "h-12" }: SectionDividerProps) {
  return (
    <div
      className={`w-full ${height}`}
      style={{
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`
      }}
    />
  );
}
