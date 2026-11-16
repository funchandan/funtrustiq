import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export type StoryMorphHandle = {
  setProgress: (p: number) => void;
  setPointer: (nx: number, ny: number) => void;
  setReduced: (reduced: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

/** Board volume that dissolves from solid packet → wireframe intelligence. */
export function createStoryMorph(canvas: HTMLCanvasElement): StoryMorphHandle {
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6);

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

  const packetGeo = new BoxGeometry(1.8, 2.35, 0.42);
  const packetMat = new MeshPhysicalMaterial({
    color: new Color("#0b1f3f"),
    metalness: 0.35,
    roughness: 0.28,
    clearcoat: 0.4,
  });
  const packet = new Mesh(packetGeo, packetMat);
  root.add(packet);

  const plateGeo = new BoxGeometry(1.95, 2.5, 0.06);
  const plateMat = new MeshPhysicalMaterial({
    color: new Color("#58bceb"),
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0,
    transmission: 0.4,
  });
  const plate = new Mesh(plateGeo, plateMat);
  plate.position.z = 0.2;
  root.add(plate);

  const wire = new LineSegments(
    new EdgesGeometry(new BoxGeometry(1.95, 2.5, 0.9)),
    new LineBasicMaterial({ color: new Color("#c4e8f8"), transparent: true, opacity: 0 }),
  );
  root.add(wire);

  const grid = new Group();
  root.add(grid);
  const lineMat = new LineBasicMaterial({ color: new Color("#58bceb"), transparent: true, opacity: 0 });
  for (let i = 0; i < 6; i += 1) {
    const g = new EdgesGeometry(new BoxGeometry(1.7 - i * 0.12, 0.01, 0.7));
    const seg = new LineSegments(g, lineMat.clone());
    seg.position.y = -0.9 + i * 0.36;
    grid.add(seg);
  }

  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xffffff, 1.2);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const rim = new DirectionalLight(0x58bceb, 0.7);
  rim.position.set(-3, 1, -2);
  scene.add(rim);

  let progress = 0;
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

  const applyProgress = (p: number) => {
    const t = Math.min(1, Math.max(0, p));
    packetMat.opacity = 1 - t * 0.85;
    packetMat.transparent = true;
    packet.scale.setScalar(1 - t * 0.08);
    plateMat.opacity = Math.min(1, t * 1.4);
    plate.position.z = 0.2 + t * 0.55;
    plate.rotation.y = t * 0.35;
    (wire.material as LineBasicMaterial).opacity = Math.min(1, t * 1.2);
    wire.scale.set(1 + t * 0.15, 1 + t * 0.1, 1 + t * 0.5);
    grid.children.forEach((child, i) => {
      const m = (child as LineSegments).material as LineBasicMaterial;
      m.opacity = Math.max(0, t * 1.3 - i * 0.08);
      child.position.z = t * (0.2 + i * 0.08);
    });
    root.rotation.y = -0.25 + t * 0.55;
  };

  const tick = (timeMs: number) => {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    const time = timeMs * 0.001;
    pointerX += (targetX - pointerX) * 0.08;
    pointerY += (targetY - pointerY) * 0.08;
    if (!reduced) {
      root.rotation.x = pointerY * 0.2 + Math.sin(time * 0.4) * 0.04;
      root.position.y = Math.sin(time * 0.7) * 0.05;
      root.rotation.y += pointerX * 0.002;
    }
    applyProgress(progress);
    renderer.render(scene, camera);
  };

  resize();
  applyProgress(0);
  raf = requestAnimationFrame(tick);

  return {
    setProgress(p) {
      progress = p;
      if (reduced) {
        applyProgress(p);
        renderer.render(scene, camera);
      }
    },
    setPointer(nx, ny) {
      targetX = nx;
      targetY = ny;
    },
    setReduced(value) {
      reduced = value;
    },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      packetGeo.dispose();
      packetMat.dispose();
      renderer.dispose();
    },
  };
}
