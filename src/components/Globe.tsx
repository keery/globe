import {
  useRef,
  useEffect,
  useState,
  useMemo,
  ReactElement,
  useCallback,
} from "react";
import { points } from "../points.json";
import { SphereGeometry, MeshBasicMaterial } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { convertFlatCoordsToSphereCoords, checkIsMobile } from "../utils";
import { useThree } from "@react-three/fiber";
import { useControl } from "./ControlContext";
import Marker, { MarkerProps } from "./Marker";

interface Props {
  markers: Omit<MarkerProps, "labelContainer" | "globe">[];
}

const GlobeDots = ({ markers }: Props) => {
  const [globe, setGlobe] = useState<ReactElement>();
  const [timestamp, setTimestamp] = useState<number>();
  const ref = useRef();
  const { control } = useControl();

  const { size } = useThree();

  const toggleRotatingGlobe = useCallback(
    (event) => {
      if (checkIsMobile()) {
        setTimestamp(event.timeStamp);
        if (timestamp && event.timeStamp - timestamp < 500) {
          //   @ts-ignore
          control.current.autoRotate = !control.current.autoRotate;
        }
      }
    },
    [control, timestamp]
  );

  useEffect(() => {
    if (typeof ref !== "undefined") {
      const pointMaterial = new MeshBasicMaterial({
        color: "#d4d4d4",
      });

      const array = [];
      for (let point of points) {
        const { x, y, z } = convertFlatCoordsToSphereCoords(point.x, point.y);

        if (x && y && z) {
          const sphere = new SphereGeometry(0.015, 10, 10);
          sphere.translate(x, y, z);
          array.push(sphere);
        }
      }

      const shape = BufferGeometryUtils.mergeBufferGeometries(array);

      setGlobe(
        <mesh
          ref={ref}
          geometry={shape}
          material={pointMaterial}
          name="globe"
        />
      );
    }
  }, [ref, size]);

  const labelContainer = document.getElementById("globe-markers");

  const Markers = useMemo(() => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        {...marker}
        labelContainer={labelContainer}
        globe={ref}
      />
    ));
  }, [markers, labelContainer, ref]);

  return (
    <group>
      {/* Fake sphere only used to catch clicks */}
      <mesh onPointerDown={toggleRotatingGlobe}>
        <sphereGeometry args={[2.5, 20, 20]} />
        <meshBasicMaterial opacity={0} transparent />
      </mesh>
      {globe}
      {Markers}
    </group>
  );
};

export default GlobeDots;
