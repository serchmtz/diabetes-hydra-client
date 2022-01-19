import { IOperation } from "@hydra-cg/heracles.ts";
import { Box, Heading, NameValueList, NameValuePair, Text } from "grommet";

interface Props {
  operation: IOperation;
}

const HydraOperation: React.FC<Props> = ({ operation, children }) => {
  return (
    <Box>
      <Heading level="5" margin={{ bottom: "small" , top: "none"}}>
        {(operation as any).displayName}
      </Heading>
      <Box>
        <NameValueList nameProps={{ width: "xsmall" }}>
          <NameValuePair
            name={
              <Text size="10pt" weight="bold">
                Espera:
              </Text>
            }
          >
            <Box>
              {operation.expects.length === 0 && (
                <Text size="9pt" color="status-critical">
                  NULL
                </Text>
              )}
              {operation.expects.toArray().map((e, i) => (
                <Text key={i} size="9pt" color="neutral-1">
                  {e.iri}
                </Text>
              ))}
            </Box>
          </NameValuePair>
          <NameValuePair
            name={
              <Text size="10pt" weight="bold">
                Devuelve:
              </Text>
            }
          >
            <Box>
              {operation.returns.length === 0 && (
                <Text size="9pt" color="status-critical">
                  NULL
                </Text>
              )}
              {operation.returns.toArray().map((e, i) => (
                <Text key={i} size="9pt" color="neutral-1">
                  {e.iri}
                </Text>
              ))}
            </Box>
          </NameValuePair>
        </NameValueList>
      </Box>
      {children}
    </Box>
  );
};

export default HydraOperation;
