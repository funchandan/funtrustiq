import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export type CrystalHandle = {
  setPointer: (nx: number, ny: number) => void;
  setReduced: (reduced: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

export function createHeroCrystal(canvas: HTMLCanvasElement): CrystalHandle {
  const scene = new Scene();
  scene.background = null;

  const camera = new PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.15, 5.2);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const root = new Group();
  scene.add(root);

  const geo = new IcosahedronGeometry(1.35, 0);
  const mat = new MeshPhysicalMaterial({
    color: new Color("#1f396d"),
    metalness: 0.15,
    roughness: 0.18,
    transmission: 0.55,
    thickness: 1.2,
    transparent: true,
    opacity: 0.92,
    reflectivity: 0.6,
  });
  const crystal = new Mesh(geo, mat);
  root.add(crystal);

  const facet = new Mesh(
    new IcosahedronGeometry(1.36, 0),
    new MeshPhysicalMaterial({
      color: new Color("#58bceb"),
      metalness: 0.05,
      roughness: 0.12,
      transmission: 0.7,
      thickness: 0.8,
      transparent: true,
      opacity: 0.35,
      side: DoubleSide,
    }),
  );
  root.add(facet);

  const edges = new LineSegments(
    new EdgesGeometry(geo),
    new LineBasicMaterial({ color: new Color("#c4e8f8"), transparent: true, opacity: 0.55 }),
  );
  root.add(edges);

  const orbit = new Group();
  root.add(orbit);
  const nodeMat = new MeshPhysicalMaterial({
    color: new Color("#00609e"),
    roughness: 0.25,
    metalness: 0.4,
  });
  for (let i = 0; i < 5; i += 1) {
    const node = new Mesh(new IcosahedronGeometry(0.08, 0), nodeMat);
    const a = (i / 5) * Math.PI * 2;
    node.position.set(Math.cos(a) * 2.15, Math.sin(a * 1.3) * 0.55, Math.sin(a) * 2.15);
    orbit.add(node);
  }

  scene.add(new AmbientLight(0xffffff, 0.65));
  const key = new DirectionalLight(0xffffff, 1.15);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fill = new DirectionalLight(0x58bceb, 0.55);
  fill.position.set(-4, -1, 2);
  scene.add(fill);

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let reduced = false;
  let raf = 0;
  let running = true;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const tick = (t: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (reduced) {
      renderer.render(scene, camera);
      return;
    }
    const time = t * 0.001;
    pointerX += (targetX - pointerX) * 0.06;
    pointerY += (targetY - pointerY) * 0.06;
    root.rotation.y = time * 0.18 + pointerX * 0.45;
    root.rotation.x = Math.sin(time * 0.35) * 0.12 + pointerY * 0.25;
    orbit.rotation.y = -time * 0.22;
    orbit.rotation.z = Math.sin(time * 0.2) * 0.1;
    crystal.position.y = Math.sin(time * 0.8) * 0.08;
    facet.rotation.y = -time * 0.12;
    renderer.render(scene, camera);
  };

  resize();
  raf = requestAnimationFrame(tick);

  const onVisibility = () => {
    running = document.visibilityState === "visible";
    if (running) raf = requestAnimationFrame(tick);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    setPointer(nx, ny) {
      targetX = nx;
      targetY = ny;
    },
    setReduced(value) {
      reduced = value;
      if (value) {
        root.rotation.set(0.2, 0.4, 0);
        orbit.rotation.set(0, 0.4, 0);
        crystal.position.y = 0;
        renderer.render(scene, camera);
      }
    },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
