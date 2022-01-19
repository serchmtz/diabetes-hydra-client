import { useHydra } from "../lib/HydraContext";
import { Sidebar, Nav, Box, Text } from "grommet";
import HydraAnchor from "./HydraAnchor";

interface Props {}

const HydraEntryPoint: React.FC<Props> = ({ children }) => {
  const { entryPoint } = useHydra();

  return (
    <Sidebar
      background="brand"
      round={{ corner: "left", size: "small" }}
      width="medium"
      pad="medium"
      height={{ min: "640px" }}
    >
      <Nav gap="small">
        {entryPoint && (
          <>
            <HydraAnchor iri={entryPoint.iri} key="inicio" color="light-1">
              Inicio
            </HydraAnchor>
            <Box pad={{ left: "3px" }}>
              {entryPoint.links.toArray().map((link, i) => (
                <Box direction="row" key={i}>
                  <Text color="light-1" weight="bold">
                    ↳
                  </Text>
                  <HydraAnchor iri={link.target.iri} color="light-1">
                    {link.iri.replace(link.baseUrl + "/vocab#", "")}
                  </HydraAnchor>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Nav>
      {children}
    </Sidebar>
  );
};

export default HydraEntryPoint;
