type Feature = "links" | "blogs" | "products";

export type FeatureConfig = Record<Feature, boolean>;

type Props = {
  value: FeatureConfig;
  onChange: (next: FeatureConfig) => void;
};

export function ToggleBar({ value, onChange }: Props) {
  const toggle = (key: Feature) => {
    onChange({
      ...value,
      [key]: !value[key],
    });
  };

  const base = "text-xs font-mono transition-all";
  const active = "text-foreground font-bold";
  const inactive = "text-muted-foreground hover:text-foreground";

  return (
    <div className="flex items-center justify-between w-full">
      {(Object.keys(value) as Feature[]).map((key) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          aria-pressed={value[key]}
          className={`${base} ${value[key] ? active : inactive}`}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
