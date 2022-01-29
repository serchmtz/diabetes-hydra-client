import { useContext, useState } from "react";
import { useHydra } from "../lib/HydraContext";
import {
  Sidebar,
  Nav,
  Box,
  Text,
  ResponsiveContext,
  Collapsible,
  Button,
} from "grommet";
import { Menu, Close } from "grommet-icons";
import HydraAnchor from "./HydraAnchor";

interface Props {}

const HydraEntryPoint: React.FC<Props> = ({ children }) => {
  const { entryPoint } = useHydra();
  const size = useContext(ResponsiveContext);
  const [open, setOpen] = useState(false);
  return (
    <Sidebar
      background="brand"
      round={size === "small" ? "small" : { corner: "left", size: "small" }}
      // width={size === "small" ? "100%" : "medium"}
      pad={{ top: "medium", bottom: "medium", left: "medium", right: "2em" }}
      align="start"
      height={{ min: size === "small" ? "none" : "720px" }}
    >
      <Button
        plain
        icon={open ? <Close /> : <Menu />}
        onClick={() => setOpen(!open)}
      />
      <Collapsible
        open={open}
        direction={size === "small" ? "vertical" : "horizontal"}
      >
        <Nav gap="small" margin={{ top: "small" }} width="medium">
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
      </Collapsible>
    </Sidebar>
  );
};

export default HydraEntryPoint;
