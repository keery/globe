import { useEffect, useRef, useState, Ref } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Mesh } from "three";
import { convertCoordinatesToCartesian } from "../utils";
import { useControl } from "./ControlContext";
import { checkIsMobile } from "../utils";

export interface MarkerProps {
  id: number;
  lat: number;
  lng: number;
  name: string;
  labelContainer: HTMLElement | null;
  globe: Ref<any>;
  onClick: () => void;
}

const Marker = ({
  id,
  lat,
  lng,
  name,
  labelContainer,
  globe,
  onClick,
}: MarkerProps) => {
  const [label, setLabel] = useState<HTMLElement>();
  const { size, camera } = useThree();
  const tempV = new Vector3();
  const ref = useRef<Mesh>();
  const { x, y, z } = convertCoordinatesToCartesian(lat, lng);
  const { control } = useControl();

  useEffect(() => {
    const labelId = `marker-label-${id}`;
    const isExist = document.getElementById(labelId);

    if (labelContainer && !isExist) {
      const label = document.createElement("div");
      const labelText = document.createElement("div");
      const labelInfoContainer = document.createElement("div");

      labelInfoContainer.setAttribute("class", "marker-label-info");
      label.setAttribute("class", "marker-label");
      label.setAttribute("id", labelId);
      labelText.setAttribute("class", "marker-label-text");
      labelText.textContent = name;

      labelInfoContainer.appendChild(labelText);
      label.appendChild(labelInfoContainer);

      labelContainer.appendChild(label);
      setLabel(label);
    }
  }, [labelContainer, name, id, globe]);

  useFrame(() => {
    if (label && globe && typeof ref?.current !== "undefined") {
      const marker = ref.current;

      tempV.copy(marker.position);
      tempV.project(camera);

      const x = (tempV.x * 0.5 + 0.5) * size.width;
      const y = (tempV.y * -0.5 + 0.5) * size.height;

      label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      label.style.zIndex = (((-tempV.z * 0.5 + 0.5) * 100000) | 0).toString();
    }
  });

  return (
    <group>
      <mesh ref={ref} position={[x, y, z]}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh
        position={[x, y, z]}
        onPointerDown={() => {
          onClick();
          if (checkIsMobile() && label) {
            if (label?.classList.contains("ishover")) {
              label.classList.remove("ishover");
            } else {
              label.classList.add("ishover");
            }
          }
        }}
        onPointerEnter={() => {
          if (label) {
            if (typeof control !== "undefined") {
              //   @ts-ignore
              control.current.autoRotate = false;
            }
            document.body.style.cursor = "pointer";
            label.classList.add("ishover");
          }
        }}
        onPointerOut={() => {
          if (label) {
            if (typeof control !== "undefined") {
              //   @ts-ignore
              control.current.autoRotate = true;
            }
            document.body.style.cursor = "auto";
            label.classList.remove("ishover");
          }
        }}
      >
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshBasicMaterial color="red" opacity={0} transparent />
      </mesh>
    </group>
  );
};

export default Marker;
