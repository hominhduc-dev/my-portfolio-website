import { ExternalLink, Github } from "lucide-react";
import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import {
  SiAmazonwebservices,
  SiDocker,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiGraphql,
  SiHibernate,
  SiJavascript,
  SiKubernetes,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiSpring,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

type TechIcon = {
  Icon: IconType;
  color: string;
};

const TECH_ICONS: Record<string, TechIcon> = {
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  ts: { Icon: SiTypescript, color: "#3178C6" },
  react: { Icon: SiReact, color: "#61DAFB" },
  reactjs: { Icon: SiReact, color: "#61DAFB" },
  nextjs: { Icon: SiNextdotjs, color: "currentColor" },
  next: { Icon: SiNextdotjs, color: "currentColor" },
  nodejs: { Icon: SiNodedotjs, color: "#339933" },
  node: { Icon: SiNodedotjs, color: "#339933" },
  express: { Icon: SiExpress, color: "currentColor" },
  expressjs: { Icon: SiExpress, color: "currentColor" },
  java: { Icon: FaJava, color: "#007396" },
  javafx: { Icon: FaJava, color: "#007396" },
  spring: { Icon: SiSpring, color: "#6DB33F" },
  springboot: { Icon: SiSpring, color: "#6DB33F" },
  hibernate: { Icon: SiHibernate, color: "#59666C" },
  python: { Icon: SiPython, color: "#3776AB" },
  postgres: { Icon: SiPostgresql, color: "#336791" },
  postgresql: { Icon: SiPostgresql, color: "#336791" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  redis: { Icon: SiRedis, color: "#DC382D" },
  supabase: { Icon: SiSupabase, color: "#3FCF8E" },
  prisma: { Icon: SiPrisma, color: "currentColor" },
  tailwindcss: { Icon: SiTailwindcss, color: "#38BDF8" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  aws: { Icon: SiAmazonwebservices, color: "#FF9900" },
  github: { Icon: SiGithub, color: "currentColor" },
  git: { Icon: SiGit, color: "#F05032" },
  graphql: { Icon: SiGraphql, color: "#E10098" },
  figma: { Icon: SiFigma, color: "#A259FF" },
  vercel: { Icon: SiVercel, color: "currentColor" },
  linux: { Icon: SiLinux, color: "#FCC624" },
};

const normalizeTag = (tag: string) =>
  tag.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function ProjectCard({ project }: ProjectCardProps) {
  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    if (/^(https?:)?\/\//i.test(url)) return url;
    if (/^(mailto|tel):/i.test(url)) return url;
    return `https://${url}`;
  };
  const liveUrl = normalizeUrl(project.links.live);
  const githubUrl = normalizeUrl(project.links.github);

  return (
    <Card className="overflow-hidden hover-lift group h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-medium">{project.title}</h3>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => {
            const key = normalizeTag(tag);
            const icon = TECH_ICONS[key];
            if (!icon) {
              return (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              );
            }
            const Icon = icon.Icon;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80"
              >
                <Icon size={14} color={icon.color} />
                <span>{tag}</span>
              </span>
            );
          })}
          {project.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {liveUrl && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Live
            </a>
          </Button>
        )}
        {githubUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-1" />
              Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
