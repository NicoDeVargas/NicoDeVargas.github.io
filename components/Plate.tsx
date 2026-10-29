import { fallbackSrc, plateInfo, srcSet } from "@/lib/paths";
import type { PlateName } from "@/content/projects";

type Props = {
  name: PlateName | "avatar";
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** <picture> com AVIF + WebP responsivos de uma gravura recolorida. */
export function Plate({ name, alt, sizes, className, priority, style }: Props) {
  const info = plateInfo(name);
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, "webp")} sizes={sizes} />
      { }
      <img
        src={fallbackSrc(name)}
        alt={alt}
        width={info.width}
        height={info.height}
        sizes={sizes}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
