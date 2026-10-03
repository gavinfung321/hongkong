import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshLambertMaterial, SphereGeometry } from 'three';
import { WORLD } from '../data/world.js';
import { addLampLight } from './lamps.js';
import { seededRandom } from './random.js';

// People standing on the Clock Tower promontory (user choices, 2026-10-03:
// the plaza read empty in 02; standing still, not walking). Simple figures,
// about 1.7 m: a tapered body, a head and two legs, in muted clothes the
// lamps warm. Each stands at [x, z] facing `face` (radians, 0 toward +x,
// the sea beyond railing B).
const CLOTHES = [0x8a7a9a, 0xb09070, 0x6a7c98, 0xc0a0a8, 0x9a9080, 0xa86a78];

const body = new CylinderGeometry(0.2, 0.15, 0.66, 8).translate(0, 1.2, 0);
const head = new SphereGeometry(0.11, 10, 8).translate(0, 1.64, 0);
const leg = new BoxGeometry(0.12, 0.88, 0.14).translate(0, 0.44, 0);

function createFigure(colour, scale) {
  const clothes = addLampLight(new MeshLambertMaterial({ color: colour }));
  const skin = addLampLight(new MeshLambertMaterial({ color: 0x8a6a58 }));
  const figure = new Group();
  const legs = [-0.08, 0.08].map((z) => {
    const mesh = new Mesh(leg, clothes);
    mesh.position.z = z;
    return mesh;
  });
  figure.add(new Mesh(body, clothes), new Mesh(head, skin), ...legs);
  figure.scale.setScalar(scale);
  return figure;
}

export function createPeople() {
  const group = new Group();
  group.name = 'people';
  const { seed, list } = WORLD.foreground.people;
  const random = seededRandom(seed);
  const y = WORLD.kowloon.blocks[0][4];
  list.forEach(({ position: [x, z], face = 0 }, i) => {
    const figure = createFigure(CLOTHES[i % CLOTHES.length], 0.94 + random() * 0.12);
    figure.position.set(x, y, z);
    figure.rotation.y = face;
    group.add(figure);
  });
  return { group };
}
