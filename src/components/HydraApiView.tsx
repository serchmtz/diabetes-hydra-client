import { useHydra } from "../lib/HydraContext";
import { Spinner, Box, Text, Button, ResponsiveContext } from "grommet";
import HydraEntryPoint from "./HydraEntryPoint";
import HydraHypermedia from "./HydraHypermedia";
import HydraClass from "./HydraClass";
import { Refresh, DocumentMissing } from "grommet-icons";
import { useContext } from "react";
interface Props {}

const HydraApiView: React.FC<Props> = ({ children }) => {
  const { loading, hypermedia, hydraClass, error } = useHydra();
  const size = useContext(ResponsiveContext);
  // console.log("hydraApiview render");
  if (!!error) {
    return (
      <Box
        round="small"
        background="light-2"
        pad="large"
        justify="center"
        align="center"
        margin="medium"
        height="80vh"
      >
        <DocumentMissing size="large" />
        <Text margin="medium">Algo salió mal</Text>

        <Button
          label="Recargar"
          primary
          icon={<Refresh />}
          onClick={() => window.location.reload()}
        />
      </Box>
    );
  }
  return (
    <Box justify="center" align="center">
      <div hidden={!loading}>
        <Spinner size="large" margin="30vh" />
      </div>
      <div hidden={loading} style={{ width: "100%" }}>
        <Box direction={size === "small" ? "column" : "row"}>
          <HydraEntryPoint />
          <HydraHypermedia hypermedia={hypermedia} />
          <HydraClass hydraClass={hydraClass} />
          {children}
        </Box>
      </div>
    </Box>
  );
};

export default HydraApiView;
