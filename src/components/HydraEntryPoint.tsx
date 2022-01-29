import { useContext } from "react";
import { useHydra } from "../lib/HydraContext";
import { Sidebar, Nav, Box, Text, ResponsiveContext } from "grommet";
import HydraAnchor from "./HydraAnchor";

interface Props {}

const HydraEntryPoint: React.FC<Props> = ({ children }) => {
  const { entryPoint } = useHydra();
  const size = useContext(ResponsiveContext);
  return (
    <Sidebar
      background="brand"
      round={size === "small" ? "small" : { corner: "left", size: "small" }}
      width={size === "small" ? "100%" : "medium"}
      pad="medium"
      height={{ min: size === "small" ? "120px" : "640px" }}
    >
      <Nav gap="small">
        {entryPoint && (
          <>
            <HydraAnchor iri={entryPoint.iri} key="inicio" color="light-1">
              Inicio
            </HydraAnchor>
            <Box pad={{ left: "2px" }}>
              {entryPoint.links.toArray().map((link, i) => (
                <Box direction="row" key={i} gap="xxsmall">
                  <Text color="light-1" weight="bold">
                    ⮡
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
