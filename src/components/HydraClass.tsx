import { IClass } from "@hydra-cg/heracles.ts";
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
  NameValueList,
  NameValuePair,
  ResponsiveContext,
} from "grommet";
import { useContext } from "react";

interface Props {
  hydraClass: IClass | null;
}

const HydraClass: React.FC<Props> = ({ hydraClass, children }) => {
  const size = useContext(ResponsiveContext);
  if (!hydraClass) {
    return (
      <Card
        background="light-4"
        pad="small"
        width="large"
        round={size === "small" ? "small" : { corner: "right", size: "small" }}
      >
        <CardHeader pad="small" justify="center">
          <Heading level="5">Documentación de la API</Heading>
        </CardHeader>
      </Card>
    );
  }
  return (
    <Card
      style={{ boxShadow: "none" }}
      background="light-4"
      pad="small"
      width="large"
      round={size === "small" ? "small" : { corner: "right", size: "small" }}
    >
      <CardHeader pad="small" justify="center" direction="column">
        <Heading level="4">Documentación de la API</Heading>
        <Text weight="bold" >{hydraClass.displayName}</Text>
        <Text textAlign="center">{hydraClass.description}</Text>
      </CardHeader>
      <CardBody overflow="auto" pad="small">
        {hydraClass.supportedProperties.length > 0 && (
          <Heading level="5">Propiedades soportadas</Heading>
        )}
        <Accordion>
          {hydraClass.supportedProperties.toArray().map((prop, i) => (
            <AccordionPanel
              label={
                <Heading level="6" margin="none">
                  {prop.property.displayName}
                </Heading>
              }
              key={i}
            >
              <Box
                pad="xsmall"
                background="light-3"
                round="xsmall"
                width="100%"
              >
                <NameValueList
                  nameProps={{ width: "10%" }}
                  valueProps={{ width: "90%" }}
                >
                  <NameValuePair
                    name={
                      <Text size="8pt" weight="bold">
                        {"@id:"}
                      </Text>
                    }
                  >
                    <Text size="8pt" color="dark-2">
                      {prop.property.iri}
                    </Text>
                  </NameValuePair>
                  <NameValuePair
                    name={
                      <Text size="8pt" weight="bold">
                        Rango:
                      </Text>
                    }
                  >
                    <Text size="8pt" color="neutral-1">
                      {prop.property.valuesOfType.first().iri}
                    </Text>
                  </NameValuePair>
                  <NameValuePair
                    name={
                      <Text size="8pt" weight="bold">
                        Requerida:
                      </Text>
                    }
                  >
                    <Text size="8pt" color="dark-2">
                      {prop.required ? "Sí" : "No"}
                    </Text>
                  </NameValuePair>
                </NameValueList>
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
