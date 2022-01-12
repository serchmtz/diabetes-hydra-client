import { ICollection } from "@hydra-cg/heracles.ts";
import { Box, Heading, NameValueList, NameValuePair, Text } from "grommet";
import HydraAnchor from "./HydraAnchor";

interface Props {
  hydraCollection: ICollection;
}

const HydraCollection = ({ hydraCollection }: Props) => {
  const memberType =
    hydraCollection.members.first().type.first() ||
    "https://www.w3.org/ns/hydra/core#Class";
  return (
    <Box>
      <Heading level="3">Información de la colección</Heading>
      <NameValueList>
        <NameValuePair name="Clase de los elementos:">
          <HydraAnchor iri={memberType}>
            {memberType.replace(/.+#/g, "")}
          </HydraAnchor>
        </NameValuePair>
        <NameValuePair name="Elementos totales:">
          <Text>{hydraCollection.totalItems}</Text>
        </NameValuePair>
      </NameValueList>
      <Heading level="3">Elementos</Heading>
      {hydraCollection.members &&
        hydraCollection.members.toArray().map((resource, i) => (
          <HydraAnchor key={i} iri={resource.iri}>
            {resource.iri}
          </HydraAnchor>
        ))}
    </Box>
  );
};

export default HydraCollection;
