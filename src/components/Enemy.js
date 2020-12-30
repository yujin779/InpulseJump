import React, { useRef, useState } from "react";
import * as THREE from "three";
import { View, Text } from "react-native";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
// import * as CANNON from "cannon";
// import { createGlobalState } from "react-hooks-global-state";
import { Physics, useBox, usePlane, useSphere } from "use-cannon";
import { useGlobalState } from "../Global";

/*
 * タップするとジャンプするプレイヤー
 */
const Enemy = ({ number }) => {
  const distance = 50;

  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [1, 1, 1],
    position: [Math.random() * distance + 8, 3, 0]
  }));
  const speed = 0.08;

  useFrame(({ clock }) => {
    api.position.set(
      ref.current.position.x - speed,
      ref.current.position.y,
      ref.current.position.z
    );

    if (ref.current.position.x < -10 || ref.current.position.y < -10) {
      api.position.set(Math.random() * distance + 8, 1, Math.random() - 0.5);
    }
    // console.log(ref.current.position.x);
  });
  return (
    <mesh ref={ref} name="enemy">
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={"green"} />
    </mesh>
  );
};
export default Enemy;
