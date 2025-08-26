import Image from "next/image";
import { useEffect, useState } from "react";

import { cn, getTechLogos } from "@/lib/utils";

interface TechIcon {
  tech: string;
  url: string;
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error("Error loading tech icons:", error);
        // Fallback to default tech icon
        setTechIcons(
          techStack.slice(0, 3).map((tech) => ({ tech, url: "/tech.svg" }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (techStack && techStack.length > 0) {
      loadTechIcons();
    }
  }, [techStack]);

  if (isLoading) {
    return (
      <div className="flex flex-row">
        {techStack.slice(0, 3).map((tech, index) => (
          <div
            key={tech}
            className={cn(
              "relative group bg-dark-300 rounded-full p-2 flex flex-center",
              index >= 1 && "-ml-3"
            )}
          >
            <div className="size-5 bg-zinc-600 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>

          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
