import { DirectionalLight, Group, HemisphereLight } from 'three';
import { PALETTE } from './palette.js';

export function createLighting() {
  const group = new Group();

  const hemisphere = new HemisphereLight(0x9a8fd0, 0x0d0b18, 2.2);
  group.add(hemisphere);

  const rim = new DirectionalLight(PALETTE.rim, 1.6);
  rim.position.set(-600, 500, -2600);
  group.add(rim);
  group.add(rim.target);

  return group;
}
