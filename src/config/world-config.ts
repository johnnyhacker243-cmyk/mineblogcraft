import type { ScreenId } from "./ui-config";
export interface WorldPose {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
}
export interface WorldEntrance {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  z: number;
  target: ScreenId | null;
}
export const worldConfig = {
  size: 100,
  eyeHeight: 1.65,
  radius: 0.3,
  speed: 5,
  sprintSpeed: 8,
  sensitivity: 0.0022,
  fov: 75,
  pixelRatioCap: 1.5,
  spawn: { x: 0, z: 45, yaw: 0, pitch: 0.16 } as WorldPose,
};
export const worldEntrances: WorldEntrance[] = [
  {
    id: "knowledge",
    name: "Knowledge Hall",
    subtitle: "知识图书馆 · MineWiki",
    x: -18,
    z: -13,
    target: "wiki",
  },
  {
    id: "research",
    name: "Research Gallery",
    subtitle: "论文展馆 · MineResearch",
    x: 18,
    z: -13,
    target: "realms",
  },
  {
    id: "workshop",
    name: "Project Workshop",
    subtitle: "项目工作室 · 展示待开放",
    x: -18,
    z: 8,
    target: null,
  },
  {
    id: "status",
    name: "Status Chamber",
    subtitle: "系统附魔室 · MineStatus",
    x: 0,
    z: -30,
    target: "status",
  },
  {
    id: "portal",
    name: "Portal Room",
    subtitle: "信息传送门 · MineRSS",
    x: 18,
    z: 8,
    target: "multiplayer",
  },
  {
    id: "blog",
    name: "World Journal",
    subtitle: "世界日志 · MineBlog",
    x: 4,
    z: 17,
    target: "worlds",
  },
  {
    id: "profile",
    name: "Curator",
    subtitle: "作者档案 · YTC",
    x: -4,
    z: 17,
    target: "profile",
  },
];
