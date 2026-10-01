import { DirectionalLight, Group, HemisphereLight } from 'three';
import { PALETTE } from './palette.js';

export function createLighting() {
  const group = new Group();

  // Low fill so the night stays dark and local lights (Clock Tower flood,
  // ferry and junk lamps, lit windows) carry the frame.
  const hemisphere = new HemisphereLight(0x9a8fd0, 0x0d0b18, 0.8);
  group.add(hemisphere);

  const rim = new DirectionalLight(PALETTE.rim, 1.6);
  rim.position.set(-600, 500, -2600);
  group.add(rim);
  group.add(rim.target);

  return group;
}
