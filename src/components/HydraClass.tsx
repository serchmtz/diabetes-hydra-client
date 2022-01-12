import { IClass } from "@hydra-cg/heracles.ts";
// import { useHydra } from "../lib/HydraContext";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Accordion,
  AccordionPanel,
  Text,
  Heading,
  Box,
} from "grommet";

interface Props {
  hydraClass: IClass | null;
}

const HydraClass: React.FC<Props> = ({ hydraClass, children }) => {
  if (!hydraClass) {
    return (
      <Card background="light-4" pad="small" width="medium">
        <CardHeader pad="small" justify="center">
          <Heading level="5">ApiDocumentation</Heading>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card background="light-4" pad="small" width="large">
      <CardHeader pad="small" justify="center" direction="column">
        <Heading level="4">{hydraClass.displayName}</Heading>
        <Text>{hydraClass.description}</Text>
      </CardHeader>
      <CardBody overflow="auto">
        {hydraClass.supportedProperties.length > 0 && (
          <Heading level="5">Propiedades</Heading>
        )}
        <Accordion>
          {hydraClass.supportedProperties.toArray().map((prop, i) => (
            <AccordionPanel
              label={<Heading level="6" margin="none">{prop.property.displayName}</Heading>}
              key={i}
            >
              <Box pad="none" background="light-2">
                <Text size="8pt">{prop.property.valuesOfType.first().iri}</Text>
              </Box>
            </AccordionPanel>
          ))}
        </Accordion>
        {children}
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default HydraClass;
