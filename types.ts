
export interface PlanetData {
  id: string;
  name: string;
  color: string;
  radius: number; // Relative visual size
  distance: number; // Distance from sun
  speed: number; // Orbit speed
  description: string;
  hasRing?: boolean;
  startAngle: number; // Initial position radian
}

export interface PlanetInfoState {
  name: string;
  description: string;
  loading: boolean;
}
