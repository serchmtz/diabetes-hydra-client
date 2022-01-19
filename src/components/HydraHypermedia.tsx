import { IHypermediaContainer } from "@hydra-cg/heracles.ts";
import {
  Box,
  Text,
  Markdown,
  Accordion,
  AccordionPanel,
  Heading,
  NameValueList,
  NameValuePair,
  Tip,
} from "grommet";
import { useEffect, useState } from "react";
import jsonld from "jsonld";
import { useHydra } from "../lib/HydraContext";
import HydraAnchor from "./HydraAnchor";

interface Props {
  hypermedia: IHypermediaContainer | null;
}
interface State {
  graph: any;
  properties: JSX.Element[];
  members: JSX.Element[];
}

const HydraHypermedia = ({ hypermedia }: Props) => {
  const { apiDoc } = useHydra();
  const [state, setState] = useState<State>();

  //  console.log("hypermedia: ", hypermedia);
  useEffect(() => {
    if (!hypermedia || !apiDoc) return;
    const init = async () => {
      const res = await hypermedia.json();
      const graph = (await jsonld.expand(res))[0];
      // console.log("res: ", res);
      // console.log("graph: ", graph);
      const hclass = apiDoc.supportedClasses
        .ofIri(hypermedia.type.first())
        .first();
      const properties = new Array<JSX.Element>();
      const members = new Array<JSX.Element>();
      if (graph) {
        let i = 0;
        for (const prop of hclass.supportedProperties) {
          const value = graph[prop.property.iri];
          if (value && value instanceof Array && value.length > 0) {
            const val = (value.at(0) || {}) as {
              "@id"?: string;
              "@value"?: string;
            };
            properties.push(
              <NameValuePair
                key={i++}
                name={
                  <Tip
                    content={
                      <Box>
                        <Text size="10pt" color="status-critical">
                          {prop.property.iri}
                        </Text>
                      </Box>
                    }
                  >
                    <Text size="12pt" style={{ cursor: "help" }} weight="bold">
                      {prop.property.displayName}
                    </Text>
                  </Tip>
                }
              >
                {val["@id"] ? (
                  <HydraAnchor iri={val["@id"]} size="12pt" withOperations>
                    {val["@id"]}
                  </HydraAnchor>
                ) : (
                  <Tip
                    content={
                      <Box overflow="auto">
                        <Text
                          size="10pt"
                          color="status-critical"
                          wordBreak="break-word"
                        >
                          {prop.property.valuesOfType.first().iri}
                        </Text>
                      </Box>
                    }
                  >
                    <Text size="12pt" style={{ cursor: "help" }}>
                      {val["@value"]}
                    </Text>
                  </Tip>
                )}
              </NameValuePair>
            );
          }
        }

        if (hypermedia.members) {
          i = 0;
          for (const member of hypermedia.members) {
            members.push(
              <HydraAnchor
                iri={member.iri}
                key={i++}
                size="12pt"
                withOperations
              >
                {member.iri}
              </HydraAnchor>
            );
          }
        }
      }

      setState({
        graph: await jsonld.compact(res, res["@context"]),
        properties,
        members,
      });
    };
    init();
  }, [hypermedia, apiDoc]);
  if (!hypermedia) {
    return <Box background="light-1" pad="medium" width="large"></Box>;
  }
  // console.log('response: ', response);

  return (
    <Box background="light-1" pad="medium" fill="horizontal">
      <Heading level="4">
        <Box direction="row" gap="small">
          {"@id:"}
          <HydraAnchor iri={hypermedia.iri} withOperations>
            {hypermedia.iri}
          </HydraAnchor>
        </Box>
      </Heading>
      {state && (
        <>
          <Box pad="small" background="light-3" round="small">
            {state.properties.length > 0 && (
              <Heading level="5" margin="none">
                Propiedades
              </Heading>
            )}
            <Box margin={{ top: "small" }}>
              <NameValueList>{state.properties}</NameValueList>
            </Box>

            {state.members.length > 0 && (
              <Heading level="5" margin="none">
                Miembros de la colección
              </Heading>
            )}
            <Box margin={{ top: "small" }}>{state.members}</Box>
          </Box>

          <Accordion margin={{ top: "small" }}>
            <AccordionPanel
              label={
                <Heading level="5" margin="none">
                  Respuesta JSON-LD
                </Heading>
              }
            >
              <Box
                background="light-3"
                round="small"
                pad="small"
                margin={{ top: "small", bottom: "small" }}
              >
                <Markdown style={{ fontSize: "10pt" }}>
                  {`
\`\`\`json
${JSON.stringify(state.graph, null, 2)}
\`\`\`
`}
                </Markdown>
              </Box>
            </AccordionPanel>
          </Accordion>
        </>
      )}
    </Box>
  );
};
export default HydraHypermedia;
