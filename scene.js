import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const canvas = document.querySelector('#mechanism-canvas');
if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 0.2, 8.5);
  scene.add(new THREE.HemisphereLight(0xbdeff0, 0x12202c, 2));
  const keyLight = new THREE.DirectionalLight(0x83e9ed, 3.2);
  keyLight.position.set(-3, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x718aff, 18, 12);
  rimLight.position.set(3, -2, 2);
  scene.add(rimLight);

  const assembly = new THREE.Group();
  const gearGroup = new THREE.Group();
  const teeth = 12;
  const gearShape = new THREE.Shape();
  for (let step = 0; step < teeth * 4; step += 1) {
    const angle = (step / (teeth * 4)) * Math.PI * 2;
    const radius = step % 4 === 1 || step % 4 === 2 ? 1.53 : 1.28;
    const point = new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius);
    if (step === 0) gearShape.moveTo(point.x, point.y);
    else gearShape.lineTo(point.x, point.y);
  }
  gearShape.closePath();
  const bore = new THREE.Path();
  bore.absarc(0, 0, 0.51, 0, Math.PI * 2, true);
  gearShape.holes.push(bore);
  const gearGeometry = new THREE.ExtrudeGeometry(gearShape, { depth: 0.3, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 3 });
  gearGeometry.center();
  const gearMaterial = new THREE.MeshStandardMaterial({ color: 0x6bd9dc, metalness: 0.76, roughness: 0.28 });
  const gear = new THREE.Mesh(gearGeometry, gearMaterial);
  gearGroup.add(gear);

  const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x162932, metalness: 0.82, roughness: 0.24 });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.22, 32), hubMaterial);
  hub.rotation.x = Math.PI / 2;
  gearGroup.add(hub);
  const hubRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.045, 8, 32), new THREE.MeshStandardMaterial({ color: 0xffb36b, metalness: 0.62, roughness: 0.32 }));
  hubRing.position.z = 0.14;
  gearGroup.add(hubRing);

  const boltMaterial = new THREE.MeshStandardMaterial({ color: 0xc3ebeb, metalness: 0.72, roughness: 0.25 });
  for (let index = 0; index < 6; index += 1) {
    const angle = (index / 6) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 8), boltMaterial);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(Math.cos(angle) * 0.67, Math.sin(angle) * 0.67, 0.18);
    gearGroup.add(bolt);
  }
  assembly.add(gearGroup);

  const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x88a7ff, metalness: 0.7, roughness: 0.3 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 2.35, 12), rodMaterial);
  rod.position.set(1.05, 0.52, -0.08);
  rod.rotation.z = -0.48;
  assembly.add(rod);
  const rodJoint = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12), new THREE.MeshStandardMaterial({ color: 0xffb36b, metalness: 0.6, roughness: 0.3 }));
  rodJoint.position.set(1.89, 1.45, -0.08);
  assembly.add(rodJoint);

  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x76dfe2, transparent: true, opacity: 0.25 });
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.07, 0.008, 4, 120), orbitMaterial);
  orbit.rotation.x = 0.56;
  orbit.rotation.y = -0.18;
  assembly.add(orbit);
  const ticks = new THREE.Group();
  for (let index = 0; index < 48; index += 1) {
    const angle = (index / 48) * Math.PI * 2;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(index % 4 === 0 ? 0.03 : 0.014, index % 4 === 0 ? 0.15 : 0.07, 0.01), orbitMaterial);
    tick.position.set(Math.cos(angle) * 2.08, Math.sin(angle) * 2.08, 0);
    tick.rotation.z = angle - Math.PI / 2;
    ticks.add(tick);
  }
  assembly.add(ticks);
  scene.add(assembly);

  let width = 0;
  let height = 0;
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === width && bounds.height === height) return;
    width = bounds.width;
    height = bounds.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 500 ? 9.5 : 8.5;
    camera.updateProjectionMatrix();
  };
  const pointer = { x: 0, y: 0 };
  canvas.parentElement.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.42;
    pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.3;
  }, { passive: true });
  canvas.parentElement.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  const render = () => {
    resize();
    const elapsed = clock.getElapsedTime();
    gearGroup.rotation.z = reducedMotion ? 0 : elapsed * 0.16;
    assembly.rotation.y += (pointer.x - assembly.rotation.y) * 0.035;
    assembly.rotation.x += (pointer.y - assembly.rotation.x) * 0.035;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}
