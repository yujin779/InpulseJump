// App.js
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { View, Text } from "react-native";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
import CameraController from "./components/CameraController";
import { Physics, useBox, usePlane, useSphere } from "use-cannon";
import { useStore } from "./Global";
import styles from "./styles";
// import { useGlobalState } from "./Global";

import Floor from "./components/Floor";
import Player from "./components/Player";
import Enemy from "./components/Enemy";

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
