<script>
  import { T, useTask, useThrelte } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import Stats from "three/addons/libs/stats.module.js";
  import * as THREE from "three/webgpu";

  const { scene, dom, invalidate } = useThrelte();
  // scene.background = new THREE.Color(0xc1c1c1);

  // All geometries
  const geometries = [
    new THREE.ConeGeometry(1.0, 2.0, 3, 1),
    new THREE.BoxGeometry(2.0, 2.0, 2.0),
    new THREE.PlaneGeometry(2.0, 2, 1, 1),
    new THREE.CapsuleGeometry(),
    new THREE.CircleGeometry(1.0, 3),
    new THREE.CylinderGeometry(1.0, 1.0, 2.0, 3, 1),
    new THREE.DodecahedronGeometry(1.0, 0),
    new THREE.IcosahedronGeometry(1.0, 0),
    new THREE.OctahedronGeometry(1.0, 0),
    new THREE.PolyhedronGeometry([0, 0, 0], [0, 0, 0], 1, 0),
    new THREE.RingGeometry(1.0, 1.5, 3),
    new THREE.SphereGeometry(1.0, 3, 2),
    new THREE.TetrahedronGeometry(1.0, 0),
    new THREE.TorusGeometry(1.0, 0.5, 3, 3),
    new THREE.TorusKnotGeometry(1.0, 0.5, 20, 3, 1, 1),
  ];

  const total = 3000;
  const group = new THREE.Group();
  scene.add(group);

  const dummy = new THREE.Object3D();
  const stats = new Stats();
  dom.appendChild(stats.dom);

  const rotationAxes = [];
  const rotationSpeeds = [];
  const instancedMeshes = [];

  const tempQuat = new THREE.Quaternion();
  const tempMatrix = new THREE.Matrix4();

  // Helper to create one instanced mesh
  function createInstancedMesh(geometry, count) {
    const material = new THREE.MeshToonMaterial({
      side: THREE.DoubleSide,
      vertexColors: true,
    });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // mesh.frustumCulled = false;
    mesh.frustumCulled = true;

    const colorArray = new Float32Array(count * 3);
    const axes = [];
    const speeds = [];
    const quaternions = [];

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        Math.random() * 80 - 40,
        Math.random() * 80 - 40,
        Math.random() * 80 - 40
      );
      dummy.quaternion.setFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
      );
      const s = 0.35 + Math.random() * 0.5;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Random color
      new THREE.Color(Math.random() * 0xffffff).toArray(colorArray, i * 3);

      // Quaternion & rotation data
      quaternions.push(dummy.quaternion.clone());
      axes.push(
        new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        ).normalize()
      );
      speeds.push(Math.random() * 0.05);
    }

    mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
    rotationAxes.push(axes);
    rotationSpeeds.push(speeds);
    instancedMeshes.push({ mesh, quaternions });
    group.add(mesh);
  }

  // Randomly distribute total count among geometries
  for (let g = 0; g < geometries.length; g++) {
    const count = Math.floor(Math.random() * (total / 4)) + 50; // variable per shape
    createInstancedMesh(geometries[g], count);
  }

  // const tempMatrix = new THREE.Matrix4();
  useTask(() => {
    stats.update();
    for (let m = 0; m < instancedMeshes.length; m++) {
      const { mesh, quaternions } = instancedMeshes[m];
      const axes = rotationAxes[m];
      const speeds = rotationSpeeds[m];

      for (let i = 0; i < mesh.count; i++) {
        // Update quaternion rotation
        tempQuat.setFromAxisAngle(axes[i], speeds[i]);
        quaternions[i].multiply(tempQuat).normalize();

        // Update instance matrix
        mesh.getMatrixAt(i, tempMatrix);
        tempMatrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.quaternion.copy(quaternions[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });
</script>

<T is={group} />
<T.PerspectiveCamera position.z={50} makeDefault>
  <OrbitControls
    autoRotate
    enableZoom={true}
    autoRotateSpeed={1}
    onchange={invalidate}
  />
</T.PerspectiveCamera>
<T.DirectionalLight intensity={3.4} />
