import { useState, useEffect } from "react";
import { Box, TextInput, Button } from "grommet";
import { PlayFill } from "grommet-icons";
import { useHydra } from "../lib/HydraContext";

interface Props {}
const EndPointInput: React.FC<Props> = () => {
  const { endpoint, setEndpoint } = useHydra();
  const [endpointInput, setEndpointInput] = useState("");

  useEffect(() => {
    setEndpointInput(endpoint);
  }, [endpoint]);

  return (
    <Box direction="row" pad="medium">
      <TextInput
        value={endpointInput}
        onKeyPress={({ key }) => {
          if (key === "Enter") setEndpoint(endpointInput);
        }}
        onChange={(next) => {
          setEndpointInput(next.target.value);
        }}
        placeholder="Endpoint"
      />
      <Button
        margin={{ left: "xsmall" }}
        icon={<PlayFill size="small" onClick={() => {}} />}
        primary
        onClick={() => {
          setEndpoint(endpointInput);
        }}
      />
    </Box>
  );
};

export default EndPointInput;
