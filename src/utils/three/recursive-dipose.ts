import { Mesh, Object3D } from 'three';

function recursiveDispose(group: Object3D) {
  group.traverse((child) => {
    recursiveDispose(child);
    if (child instanceof Mesh) {
      child.geometry?.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    }
    if (child.parent) {
      child.parent.remove(child);
    }
  });
}

export default recursiveDispose;
