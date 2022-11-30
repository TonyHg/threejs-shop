import React, { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer
} from 'three';
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

const Product: React.FC<ProductProps> = ({ isSelected }) => {
  const refContainer = useRef(null);
  const [renderer, setRenderer] = useState<WebGLRenderer>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = refContainer.current as unknown as HTMLDivElement;
    if (container !== null && !renderer && container.children.length === 1) {
      const scW = window.innerWidth;
      const scH = window.innerHeight;
      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
      });
      // renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = sRGBEncoding;
      const domElement = renderer.domElement;
      domElement.height = window.innerHeight;
      domElement.width = window.innerWidth;
      container.appendChild(domElement);
      setRenderer(renderer);

      const scene = new Scene();
      const camera = new PerspectiveCamera();
      camera.position.set(0, 0, 10);
      // camera.lookAt(new Vector3(40, 40, 0));
      const ambientLight = new AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;

      // const sphere = new Mesh(new IcosahedronGeometry(), new MeshBasicMaterial());
      // sphere.position.set(0, 0, 0);
      // scene.add(sphere);
      // const scW = window.innerWidth;
      // const scH = window.innerHeight;
      // const renderer = new WebGLRenderer();
      // renderer.setPixelRatio(window.devicePixelRatio);
      // const domElement = renderer.domElement;
      // domElement.width = scW;
      // domElement.height = scH;
      // renderer.setSize(scW, scH);
      // container.appendChild(domElement);
      // setRenderer(renderer);

      // const scene = new Scene();
      // const camera = new PerspectiveCamera();
      // camera.position.set(0, 0, 20);
      // const ambientLight = new AmbientLight(0xffffff, 1);
      // scene.add(ambientLight);
      // const controls = new OrbitControls(camera, renderer.domElement);
      // controls.autoRotate = true;

      loadGLTFModel(scene, '/products/japanese_mask.glb', {
        receiveShadow: true,
        castShadow: true
      }).then(() => {
        setLoading(false);
        renderer.render(scene, camera);
      });
    }
    return () => renderer?.dispose();
  }, []);

  return (
    <div className="h-full w-full" ref={refContainer}>
      {loading && (
        <span className="text-white" style={{ position: 'absolute', left: '50%', top: '50%' }}>
          Loading...
        </span>
      )}
    </div>
  );
};

export default Product;
