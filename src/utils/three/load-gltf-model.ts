import { Mesh, Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

export default loadGLTFModel;
