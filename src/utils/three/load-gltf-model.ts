import { Box3, Euler, Group, Mesh, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadGLTFModel(
  scene: Scene,
  glbPath: string,
  options: {
    scale?: number;
    rotation?: Euler;
    shouldTouchTheGround?: boolean;
    receiveShadow?: boolean;
    castShadow?: boolean;
  },
  onSuccess: (group: Group) => void,
  onProgress?: (progress: ProgressEvent<EventTarget>) => void
) {
  const { receiveShadow, castShadow } = options;

  const loader = new GLTFLoader();
  loader.load(
    glbPath,
    (gltf) => {
      const obj = gltf.scene;
      obj.receiveShadow = receiveShadow ?? false;
      obj.castShadow = castShadow ?? false;
      if (options.scale) obj.scale.setScalar(options.scale);
      if (options.rotation) obj.rotation.copy(options.rotation);
      const objBB = new Box3().setFromObject(obj);
      if (options.shouldTouchTheGround) obj.position.y = -objBB.min.y;
      else obj.position.y = -objBB.min.y + 0.2;
      scene.add(obj);

      obj.traverse(function (child) {
        if (child instanceof Mesh) {
          child.castShadow = castShadow ?? false;
          child.receiveShadow = receiveShadow ?? false;
        }
      });
      onSuccess(obj);
    },
    onProgress,
    function (error) {
      console.log(error);
    }
  );
}

export default loadGLTFModel;
