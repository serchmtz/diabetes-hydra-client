import {
  Anchor,
  Layer,
  Box,
} from "grommet";
import { ColorType } from "grommet/utils";
import { useState } from "react";
import { useHydra } from "../lib/HydraContext";
import HydraOperations from "./HydraOperations";

interface Props {
  iri: string;
  size?: string;
  withOperations?: boolean;
  color?: ColorType;
}
const HydraAnchor: React.FC<Props> = ({
  iri,
  size,
  withOperations,
  children,
  color,
}) => {
  const [show, setShow] = useState(false);
  const { setEndpoint } = useHydra();

  const handleOnClick = () => {
    if (!withOperations) {
      setEndpoint(iri);
    } else {
      setShow(true);
    }
  };
  return (
    <Box>
      <Anchor onClick={handleOnClick} size={size} color={color}>
        {children}
      </Anchor>
      {show && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <HydraOperations iri={iri} onCancelClicked={() => setShow(false)} />
        </Layer>
      )}
    </Box>
  );
};

export default HydraAnchor;
