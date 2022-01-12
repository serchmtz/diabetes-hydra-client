import { Anchor } from "grommet";
import { useHydra } from "../lib/HydraContext";
interface Props {
  iri: string;
  size?: string;
}
const HydraAnchor: React.FC<Props> = ({ iri, size, children }) => {
  const { setEndpoint } = useHydra();
  const handleOnClick = () => {
    setEndpoint(iri);
  };
  return <Anchor onClick={handleOnClick} size={size}>{children}</Anchor>;
};

export default HydraAnchor;
