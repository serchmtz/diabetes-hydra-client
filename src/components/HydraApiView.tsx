import { useHydra } from "../lib/HydraContext";
import { Spinner, Box } from "grommet";
import HydraEntryPoint from "./HydraEntryPoint";
import HydraHypermedia from "./HydraHypermedia";
import HydraClass from "./HydraClass";
interface Props {}

const HydraApiView: React.FC<Props> = ({ children }) => {
  const { loading, hypermedia, hydraClass } = useHydra();
  console.log("hydraApiview render");
  return (
    <Box justify="center" align="center">
      {loading ? (
        <Spinner size="large" margin="large" />
      ) : (
        <Box direction="row" width="100%">
          <HydraEntryPoint />
          <HydraHypermedia hypermedia={hypermedia} />
          <HydraClass hydraClass={hydraClass} />
          {children}
        </Box>
      )}
    </Box>
  );
};

export default HydraApiView;
