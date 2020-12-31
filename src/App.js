// App.js
import React, { useState } from "react";
import { View } from "react-native";
import { Canvas, useFrame } from "react-three-fiber";
import CameraController from "./components/CameraController";
import { Physics, useBox } from "use-cannon";
import styles from "./styles";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "react-three-fiber";
import dino from "./dino.glb";
import create from "zustand";

const useStore = create((set) => ({
  //画面がクリックされたらtrueに変更するstate
  tap: false,
  tapTrue: () => set((state) => ({ tap: true })),
  tapFalse: () => set((state) => ({ tap: false }))
}));

/*
 * ジャンプするダイナソー
 */
const Dino = () => {
  // 物理演算させるボックスのサイズ
  const args = [2, 2, 1];
  const gltf = useLoader(GLTFLoader, dino);
  // tapのstateをfalseに変更するfunction
  const tapFalse = useStore((state) => state.tapFalse);
  // tapのstateの値
  const tap = useStore((state) => state.tap);
  // 床に着地していればtrueに変更されるstate
  const [landing, setLanding] = useState(false);
  // useBoxを使用してボックス型の物理演算を設定
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: args,
    // ボックスの位置
    position: [-0.5, 3, 0],
    // 床に着地していればtrue
    onCollide: (obj) => {
      if (obj.body.name === "floor") setLanding(true);
    }
  }));
  useFrame((state) => {
    // 床に着地してクリックするとジャンプ
    if (tap && landing) {
      // ジャンプ
      api.applyImpulse([0, 20, 0], [0, 0, 0]);
      // tapのstateをfalseに変更
      tapFalse();
      // landingのstateをfalseに変更
      setLanding(false);
    }
  });
  return (
    <group ref={ref}>
      {/* 物理演算させるボックスを表示 */}
      <mesh name="player">
        <boxBufferGeometry attach="geometry" args={args} />
        <meshStandardMaterial
          attach="material"
          color={"orange"}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* ダイナソーのオブジェクト */}
      <primitive object={gltf.scene} position={[-0.4, -1, 0]} />
    </group>
  );
};

/**
 * 床
 */
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
      <meshStandardMaterial attach="material" color={"green"} />
    </mesh>
  );
};

/*
 * 1. 表示される入り口
 */
const App = () => {
  const tapTrue = useStore((state) => state.tapTrue);
  return (
    <View style={styles.app}>
      <Canvas
        camera={{
          position: [-0.2, 3, 10],
          near: 0.1,
          far: 50
        }}
        // tapのstateをtrueに変更
        onClick={(e) => {
          tapTrue();
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[8, 20, 9]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <CameraController />
        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ restitution: 0 }}
        >
          <Dino />
          <Floor position={[0, -1, 0]} args={[500, 0.5, 500]} />
        </Physics>
      </Canvas>
    </View>
  );
};
export default App;
