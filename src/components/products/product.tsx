import React, { useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  Euler,
  Fog,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RingGeometry,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import loadGLTFModel from '../../utils/three/load-gltf-model';
import recursiveDispose from '../../utils/three/recursive-dipose';

interface ProductProps {
  name: string;
  scale?: number;
  rotation?: Euler;
  shouldTouchTheGround?: boolean;
  isSelected?: boolean;
}

interface CanvasState {
  renderer: WebGLRenderer;
  container: HTMLDivElement;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  effectComposer: EffectComposer;
  descriptionCard: Mesh;
}

const Product: React.FC<ProductProps> = ({
  name,
  scale = 1,
  rotation,
  shouldTouchTheGround = false,
  isSelected = false
}) => {
  const refContainer = useRef(null);
  const [state, setState] = useState<CanvasState>();
  const [productModel, setProductModel] = useState<Group>();
  const [modelYPosition, setModelYPostion] = useState(0);
  const [clock] = useState<Clock>(new Clock());
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState<number>();

  useEffect(() => {
    if (state && !shouldTouchTheGround && productModel !== undefined) {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);

      animate(
        clock,
        state.renderer,
        state.container,
        state.scene,
        state.camera,
        state.controls,
        state.effectComposer,
        productModel,
        modelYPosition
      );
    }
  }, [productModel, modelYPosition]);

  useEffect(() => {
    if (state === undefined) return;
    state.controls.enabled = isSelected;
    if (isSelected) {
      state.descriptionCard.visible = true;
    } else {
      state.controls.reset();
      state.controls.target.set(0, 1.5, 0);
      state.descriptionCard.visible = false;
    }
  }, [state, isSelected]);

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
    clock: Clock,
    renderer: WebGLRenderer,
    container: HTMLDivElement,
    scene: Scene,
    camera: PerspectiveCamera,
    controls: OrbitControls,
    effectComposer: EffectComposer,
    productModel: Group | undefined,
    modelYPosition: number
  ) {
    if (renderer === undefined) return;
    const scW = container.clientWidth;
    const scH = container.clientHeight;

    camera.aspect = scW / scH;
    camera.updateProjectionMatrix();

    if (!shouldTouchTheGround && productModel !== undefined) {
      productModel.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2 + modelYPosition;
    }
    renderer?.setSize(scW, scH);
    effectComposer.setSize(scW, scH);
    effectComposer.render();
    controls.update();
    setAnimationFrameId(
      window.requestAnimationFrame(() =>
        animate(
          clock,
          renderer,
          container,
          scene,
          camera,
          controls,
          effectComposer,
          productModel,
          modelYPosition
        )
      )
    );
  }

  useEffect(() => {
    const container = refContainer.current as unknown as HTMLDivElement;
    if (container !== null && !state?.renderer && container.children.length === 1) {
      // RENDERER
      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // SCENE
      const scene = new Scene();
      scene.fog = new Fog(0x000000, 10, 25);
      // CAMERA
      const camera = new PerspectiveCamera();
      camera.position.set(0, 0, 10);
      //CONTROLS
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = -10;
      controls.enabled = false;
      controls.enablePan = false;
      controls.minDistance = 3;
      controls.maxDistance = 8;
      controls.minPolarAngle = Math.PI / 2;
      controls.maxPolarAngle = Math.PI / 2;
      controls.target.set(0, 1.5, 0);

      //#region LIGHTS
      const ambientLight = new AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 10;
      directionalLight.shadow.camera.far = 40;
      directionalLight.shadow.camera.top = 4;
      directionalLight.shadow.camera.right = 2;
      directionalLight.shadow.camera.bottom = -1;
      directionalLight.shadow.camera.left = -2;
      camera.add(directionalLight);

      const orangePointLight = new PointLight(0xffaa55, 0.3);
      orangePointLight.position.set(5, 5, -5);
      const greenPointLight = new PointLight(0x55ff55, 0.4);
      greenPointLight.position.set(-5, 5, -1);
      const whitePointLight = new PointLight(0xffffff, 0.5);
      whitePointLight.position.set(0, -10, 0);
      camera.add(orangePointLight);
      camera.add(greenPointLight);
      camera.add(whitePointLight);
      //#endregion

      //#region MESHES
      const plane = new Mesh(
        new PlaneGeometry(100, 100),
        new MeshStandardMaterial({
          color: 0x485ba1,
          transparent: true,
          opacity: 0.3
        })
      );
      plane.receiveShadow = true;
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0.001;
      scene.add(plane);

      const groundMirror = new Reflector(new PlaneGeometry(200, 200), {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x57668c
      });
      groundMirror.rotateX(-Math.PI / 2);
      groundMirror.receiveShadow = true;
      scene.add(groundMirror);

      const glassMaterial = new MeshPhysicalMaterial({
        color: 0xff00ff,
        roughness: 0.4,
        transmission: 0.99
      });
      glassMaterial.thickness = 0.5;

      const descriptionCardSize = { width: 1, height: 0.5, depth: 0.05 };
      const descriptionCard = new Mesh(
        new RoundedBoxGeometry(
          descriptionCardSize.width,
          descriptionCardSize.height,
          descriptionCardSize.depth,
          10,
          1
        ),
        glassMaterial
      );
      descriptionCard.position.set(0.75, 0.25, -1.5);
      descriptionCard.visible = false;
      camera.add(descriptionCard);
      scene.add(camera);

      new TextureLoader().load(`products/descriptions/${name}.png`, function (texture) {
        const geometry = new PlaneGeometry(descriptionCardSize.width, descriptionCardSize.height);
        const material = new MeshBasicMaterial({ map: texture, transparent: true });
        const planeText = new Mesh(geometry, material);
        planeText.position.set(0, 0, descriptionCardSize.depth / 2 + 0.001);
        descriptionCard.add(planeText);
      });

      const neon = new LineSegments(
        new RingGeometry(2.0, 2.15, 100, 100),
        new LineBasicMaterial({ color: 'white', linewidth: 3 })
      );
      neon.position.set(0, 1.8, -10);
      camera.add(neon);

      loadGLTFModel(
        scene,
        `products/models/${name}.glb`,
        {
          scale: scale,
          rotation: rotation,
          shouldTouchTheGround: shouldTouchTheGround,
          receiveShadow: true,
          castShadow: true
        },
        (model) => {
          setProductModel(model);
          setModelYPostion(model.position.y);
        },
        (xhr) => setLoadingProgress((xhr.loaded / xhr.total) * 100)
      ).then(() => {
        setLoading(false);
      });
      //#endregion

      //#region EFFECTS
      const effectComposer = new EffectComposer(renderer);
      effectComposer.setSize(window.innerWidth, window.innerHeight);
      effectComposer.addPass(new RenderPass(scene, camera));

      const bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.5,
        0.4
      );
      effectComposer.addPass(bloomPass);
      //#endregion

      setState({ renderer, container, scene, camera, controls, effectComposer, descriptionCard });

      animate(
        clock,
        renderer,
        container,
        scene,
        camera,
        controls,
        effectComposer,
        productModel,
        modelYPosition
      );
    }
    return () => state?.renderer.dispose();
  }, [state?.renderer]);

  // ON UNMOUNT
  useEffect(() => {
    return () => {
      if (state) {
        state.controls.dispose();
        const passes = state.effectComposer.passes;
        for (let i = state.effectComposer.passes.length - 1; i >= 0; --i) {
          const p = passes[i];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((p as any).dispose) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p as any).dispose();
          }
          state.effectComposer.removePass(p);
        }
        state.effectComposer.dispose();
        state.renderer.dispose();
        // state.scene.clear();
        recursiveDispose(state.scene);
      }
    };
  }, [state]);

  return (
    <div className="relative h-full w-full select-none" ref={refContainer}>
      {loading && (
        <span
          className="text-white font-bold text-3xl"
          style={{ position: 'absolute', left: '50%', top: '50%' }}>
          {loadingProgress} %
        </span>
      )}
    </div>
  );
};

export default Product;
