import { useHydra } from "../lib/HydraContext";
import { Sidebar, Nav, Box } from "grommet";
import HydraAnchor from "./HydraAnchor";

interface Props {}

const HydraEntryPoint: React.FC<Props> = ({ children }) => {
  const { entryPoint } = useHydra();

  return (
    <Sidebar background="brand" round="none" width="300px" height={{min: "640px"}}>
      <Nav gap="small">
        {entryPoint && (
          <>
            <HydraAnchor iri={entryPoint.iri} key="inicio">
              Inicio
            </HydraAnchor>
            <Box pad={{left: "3px"}}>
              {entryPoint.links.toArray().map((link, i) => (
                <HydraAnchor iri={link.target.iri} key={i}>
                  {"⮩ " + link.iri.replace(link.baseUrl + "/vocab#", "")}
                </HydraAnchor>
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
