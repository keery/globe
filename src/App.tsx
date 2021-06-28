import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { MarkerProps } from "./components/Marker";
import ControlContext from "./components/ControlContext";
import Globe from "./components/Globe";
import "./App.css";

// Example data
const markers = [
  {
    id: 1,
    lat: 48.8567,
    lng: 2.3508,
    name: "Paris",
    onClick: () => {
      alert("Paris");
    },
  },
  {
    id: 2,
    lat: 41.390205,
    lng: 2.154007,
    name: "Barcelone",
    onClick: () => {
      alert("Barcelone");
    },
  },
  {
    id: 3,
    lat: 45.505331312,
    lng: -73.55249779,
    name: "Montréal",
    onClick: () => {
      alert("Montréal");
    },
  },
  {
    id: 4,
    lat: -37.840935,
    lng: 144.946457,
    name: "Melbourne",
    onClick: () => {
      alert("Melbourne");
    },
  },
];

interface Props {
  markers: Omit<MarkerProps, "labelContainer" | "globe">[];
}

const Scene = ({ markers }: Props) => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight />
      <pointLight color="white" intensity={2} position={[10, 10, 10]} />
      <Globe markers={markers} />
    </>
  );
};

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <ControlContext>
          <Suspense fallback={null}>
            <Scene markers={markers} />
          </Suspense>
        </ControlContext>
      </Canvas>
      <div id="globe-markers" />
    </div>
  );
}

export default App;
