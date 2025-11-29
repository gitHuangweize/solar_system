
import { PlanetData } from './types';

// Note: These scales are adjusted for visual representation.
export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: '水星 (Mercury)',
    color: '#A0AEC0', // Lighter Metallic Gray
    radius: 0.8,
    distance: 14,
    speed: 0.8,
    startAngle: 0,
    description: '太阳系中最小的行星，也是最接近太阳的行星。',
  },
  {
    id: 'venus',
    name: '金星 (Venus)',
    color: '#ECC94B', // Bright Golden Yellow
    radius: 1.5,
    distance: 22,
    speed: 0.6,
    startAngle: 2,
    description: '太阳系中第二颗行星，是夜空中亮度仅次于月球的天体。',
  },
  {
    id: 'earth',
    name: '地球 (Earth)',
    color: '#4299E1', // Vivid Blue
    radius: 1.6,
    distance: 32,
    speed: 0.4,
    startAngle: 4,
    description: '我们的家园，目前已知唯一孕育生命的星球。',
  },
  {
    id: 'mars',
    name: '火星 (Mars)',
    color: '#F56565', // Bright Red
    radius: 1.2,
    distance: 42,
    speed: 0.3,
    startAngle: 1.5,
    description: '被称为红色星球，地表覆盖着氧化铁。',
  },
  {
    id: 'jupiter',
    name: '木星 (Jupiter)',
    color: '#ED8936', // Orange
    radius: 3.8,
    distance: 60,
    speed: 0.15,
    startAngle: 0.5,
    description: '太阳系中最大的行星，是一颗巨大的气态巨行星。',
  },
  {
    id: 'saturn',
    name: '土星 (Saturn)',
    color: '#F6E05E', // Yellow
    radius: 3.2,
    distance: 80,
    speed: 0.1,
    startAngle: 5,
    description: '以其壮观的行星环系统而闻名。',
    hasRing: true,
  },
  {
    id: 'uranus',
    name: '天王星 (Uranus)',
    color: '#4FD1C5', // Teal
    radius: 2.4,
    distance: 95,
    speed: 0.07,
    startAngle: 3,
    description: '太阳系中最冷的行星，拥有独特的侧躺自转轴。',
  },
  {
    id: 'neptune',
    name: '海王星 (Neptune)',
    color: '#667EEA', // Indigo
    radius: 2.3,
    distance: 110,
    speed: 0.05,
    startAngle: 1,
    description: '太阳系最外侧的行星，以强烈的风暴著称。',
  },
];
