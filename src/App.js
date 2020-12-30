// App.js
import React, { useState } from "react";
import * as THREE from "three";
import { View } from "react-native";
import { Canvas, useFrame } from "react-three-fiber";
import CameraController from "./components/CameraController";
import { Physics, useBox } from "use-cannon";
import { useStore } from "./Global";
import styles from "./styles";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "react-three-fiber";
import dino from "./dino.glb";

/*
 * タップするとジャンプするプレイヤー
 */
const Player = () => {
  const args = [4, 1, 4];
  const gltf = useLoader(GLTFLoader, dino);
  // console.log(gltf);
  const tapFalse = useStore((state) => state.tapFalse);
  const tap = useStore((state) => state.tap);
  const [landing, setLanding] = useState(false);
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: args,
    position: [-3, 3, 0],
    onCollide: (obj) => {
      if (obj.body.name === "floor") setLanding(true);
      if (obj.body.name === "enemy") {
        console.log("gameover");
      }
    }
  }));
  useFrame((state) => {
    if (tap && landing) {
      api.applyImpulse([0, 20, 0], [0, 0, 0]);
      tapFalse();
      setLanding(false);
    }
  });
  return (
    <group ref={ref}>
      <mesh name="player">
        <boxBufferGeometry attach="geometry" args={args} />
        <meshStandardMaterial
          attach="material"
          color={"orange"}
          transparent
          opacity={0.3}
        />
      </mesh>
      <primitive object={gltf.scene} position={[-0.4, -1, 0]} />
    </group>
  );
};

const Floor = ({ position, args, color }) => {
  const [ref] = useBox(() => ({
    type: "Static",
    mass: 0,
    args: args,
    position: position,
    name: "floor"
  }));
  return (
    <mesh ref={ref} name="floor">
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={"hotpink"} />
    </mesh>
  );
};

/*
 * 1. 表示される入り口
 */
const App = () => {
  // const [, setJump] = useGlobalState("tap");
  // const steteTap = useStore((state) => state.tap);
  const tapTrue = useStore((state) => state.tapTrue);
  return (
    <View style={styles.app}>
      <Canvas
        camera={{
          position: [-0.2, 3, 10],
          // position: [0, 30, 0],
          // lookAt: [0, 0, 0],
          // rotation: [0.1, -0.2, 0],
          // quaternion: [0.0, -0.1, 0.0],
          near: 0.1,
          far: 50
        }}
        onClick={(e) => {
          tapTrue();
        }}
        // onCreated={({ camera }) => {
        //   console.log(camera);
        //   camera.lookAt(900, 90, 0);
        //   // camera.updateProjectionMatrix();
        // }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <CameraController />
        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ restitution: 0 }}
        >
          <Player />
          {/* <Enemy />
          <Enemy /> */}
          <Floor position={[0, -1, 0]} args={[1500, 0.5, 3]} />
        </Physics>
      </Canvas>
    </View>
  );
};
export default App;
