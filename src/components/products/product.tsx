import * as TWEEN from '@tweenjs/tween.js';
import React, { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  Raycaster,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
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
      obj.rotateY(Math.PI);
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
  descriptionCard: Mesh;
}

const Product: React.FC<ProductProps> = ({ isSelected = false }) => {
  const refContainer = useRef(null);
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state === undefined) return;
    state.controls.enabled = isSelected;
    if (isSelected === false) state.controls.reset();
    if (isSelected) {
      // state.camera.position.set(0, 0, 5);
      const coords = { z: 10 };
      new TWEEN.Tween(coords)
        .to({ z: 5 }, 250)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          state.camera.position.set(0, 0, coords.z);
        })
        .start();
    }
  }, [isSelected]);

  useEffect(() => {
    const onMouseMoveCard = (event: MouseEvent) => {
      if (state === undefined) return;
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      state.descriptionCard.lookAt(
        state.camera.position.x + x * 0.5,
        state.camera.position.y + y * 0.5,
        state.camera.position.z + x * 0.5
      );
    };
    window.addEventListener('mousemove', onMouseMoveCard);
    return () => {
      window.removeEventListener('mousemove', onMouseMoveCard);
    };
  }, [state?.camera, state?.descriptionCard]);

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
    TWEEN.update();
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
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = -10;
      controls.enabled = true;
      controls.enablePan = false;
      controls.minDistance = 3;
      controls.maxDistance = 8;
      controls.minPolarAngle = Math.PI / 2;
      controls.maxPolarAngle = Math.PI / 2;

      const ambientLight = new AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true;
      camera.add(directionalLight);

      const orangePointLight = new PointLight(0xffaa55, 0.7);
      orangePointLight.position.set(1, 0, -5);
      const greenPointLight = new PointLight(0x55ff55, 0.4);
      orangePointLight.position.set(-2, 0, 1);
      camera.add(orangePointLight);
      scene.add(greenPointLight);

      const glassMaterial = new MeshPhysicalMaterial({
        color: 0xff00ff,
        roughness: 0.6,
        transmission: 0.9
      });
      glassMaterial.thickness = 0.5;

      const descriptionCard = new Mesh(new RoundedBoxGeometry(1, 0.5, 0.05, 10, 1), glassMaterial);
      descriptionCard.position.set(0.75, 0.25, -1.5);

      const loader = new TextureLoader();
      loader.load('/products/descriptions/japanese_mask.png', function (texture) {
        const geometry = new PlaneGeometry(1, 0.5);
        const material = new MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: DoubleSide
        });
        const planeText = new Mesh(geometry, material);
        planeText.position.set(0, 0, 0.05);
        descriptionCard.add(planeText);
      });

      descriptionCard.lookAt(camera.position);
      camera.add(descriptionCard);
      scene.add(camera);

      loadGLTFModel(scene, '/products/models/japanese_mask.glb', {
        receiveShadow: true,
        castShadow: true
      }).then(() => {
        setLoading(false);
      });

      setState({ renderer, container, scene, camera, controls, descriptionCard });

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