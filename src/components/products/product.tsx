import React, { useEffect, useRef, useState } from 'react';
import { AmbientLight, Mesh, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ProductProps {
  isSelected?: boolean;
}

async function loadGLTFModel(
  scene: Scene,
  glbPath: string,
  options: { receiveShadow: boolean; castShadow: boolean }
) {
  const { receiveShadow, castShadow } = options;

  const loader = new GLTFLoader();
  loader.load(
    glbPath,
    (gltf) => {
      const obj = gltf.scene;
      obj.receiveShadow = receiveShadow;
      obj.castShadow = castShadow;
      scene.add(obj);

      obj.traverse(function (child) {
        if (child instanceof Mesh) {
          child.castShadow = castShadow;
          child.receiveShadow = receiveShadow;
        }
      });

      return obj;
    },
    undefined,
    function (error) {
      console.log(error);
    }
  );
}

interface State {
  renderer: WebGLRenderer;
  container: HTMLDivElement;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
}

const Product: React.FC<ProductProps> = ({ isSelected = false }) => {
  const refContainer = useRef(null);
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state === undefined) return;
    state.controls.enabled = isSelected;
    if (isSelected === false) state.controls.reset();
  }, [isSelected]);

  function animate(
    renderer: WebGLRenderer,
    container: HTMLDivElement,
    scene: Scene,
    camera: PerspectiveCamera,
    controls: OrbitControls
  ) {
    if (renderer === undefined) return;
    const scW = container.clientWidth;
    const scH = container.clientHeight;
    renderer?.setSize(scW, scH);

    camera.aspect = scW / scH;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(() => animate(renderer, container, scene, camera, controls));
  }

  useEffect(() => {
    const container = refContainer.current as unknown as HTMLDivElement;
    if (container !== null && !state?.renderer && container.children.length === 1) {
      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
      });
      container.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new PerspectiveCamera();
      camera.position.set(0, 0, 10);
      const ambientLight = new AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = -10;
      controls.enabled = false;

      loadGLTFModel(scene, '/products/japanese_mask.glb', {
        receiveShadow: true,
        castShadow: true
      }).then(() => {
        setLoading(false);
      });

      setState({ renderer, container, scene, camera, controls });

      animate(renderer, container, scene, camera, controls);
    }
    return () => state?.renderer.dispose();
  }, [state?.renderer]);

  return (
    <div className="relative h-full w-full" ref={refContainer}>
      {loading && (
        <span className="text-white" style={{ position: 'absolute', left: '50%', top: '50%' }}>
          Loading...
        </span>
      )}
    </div>
  );
};

export default Product;
