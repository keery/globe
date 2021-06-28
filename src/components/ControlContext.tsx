import React, { useRef, createContext, useContext, Ref } from "react";
import { OrbitControls, OrbitControlsProps } from "@react-three/drei";

interface IControlContext {
  control: Ref<any> | undefined;
}

const ControlsContext = createContext<IControlContext>({ control: undefined });

interface Props extends Omit<OrbitControlsProps, "ref"> {
  children: React.ReactNode;
}

const ControlContext = ({
  children,
  autoRotate = true,
  autoRotateSpeed = 0.4,
  enableZoom = false,
  ...rest
}: Props) => {
  const control = useRef<any>(undefined);

  return (
    <ControlsContext.Provider value={{ control }}>
      {children}
      <OrbitControls
        ref={control}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        enableZoom={enableZoom}
        {...rest}
      />
    </ControlsContext.Provider>
  );
};

export default ControlContext;

export const useControl = () => useContext(ControlsContext);
