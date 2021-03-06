import { IHypermediaContainer } from "@hydra-cg/heracles.ts";
import {
    Accordion,
    AccordionPanel, Box, Heading, Markdown, NameValueList,
    NameValuePair, Paragraph, Text, Tip
} from "grommet";
import jsonld from "jsonld";
import { useEffect, useState } from "react";
import { useHydra } from "../lib/HydraContext";
import HydraAnchor from "./HydraAnchor";
// import ReactFlow, { Elements, Position } from "react-flow-renderer";

interface Props {
  hypermedia: IHypermediaContainer | null;
}
interface State {
  graph: any;
  properties: JSX.Element[];
  members: JSX.Element[];
  error: boolean;
  // elements: Elements;
}
interface GraphValue {
  "@id"?: string;
  "@value"?: string;
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
      const hclass = apiDoc.supportedClasses
        .ofIri(hypermedia.type.first())
        .first();
      // const elements: Elements = [
      //   {
      //     id: hclass.iri,
      //     data: { label: hclass.displayName },
      //     position: { x: 0, y: 150 },
      //     type: "input",
      //     sourcePosition: Position.Right,
      //     style: { borderRadius: "50%" },
      //   },
      // ];
      const properties = new Array<JSX.Element>();
      const members = new Array<JSX.Element>();
      let error = true;
      // console.log("graph: ", graph);
      if (graph && graph["@id"]) {
        let i = 0;
        for (const prop of hclass.supportedProperties) {
          const value = graph[prop.property.iri];
          if (value && value instanceof Array && value.length > 0) {
            const val = (value[0] || {}) as GraphValue;
            // elements.push({
            //   id: prop.iri,
            //   type: "output",
            //   data: {
            //     label: prop.property.valuesOfType
            //       .first()
            //       .iri.replace(/.*#/, ""),
            //   },
            //   position: { x: 250, y: i * 60 },
            //   targetPosition: Position.Left,
            //   style: { borderRadius: "50%", width: "auto", fontSize: "8pt" },
            // });
            // elements.push({
            //   id: `e${i + 1}`,
            //   source: hclass.iri,
            //   target: prop.iri,
            //   type: "step",
            //   label:
            //     prop.property.displayName === ""
            //       ? (prop as any).displayName
            //       : prop.property.displayName,
            // });
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
                    <Box overflow="auto">
                      <Text
                        size="11pt"
                        style={{ cursor: "help" }}
                        weight="bold"
                      >
                        {prop.property.displayName === ""
                          ? (prop as any).displayName
                          : prop.property.displayName}
                      </Text>
                    </Box>
                  </Tip>
                }
              >
                {val["@id"] ? (
                  <HydraAnchor iri={val["@id"]} size="11pt" withOperations>
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
                    <Paragraph
                      size="11pt"
                      style={{ cursor: "help" }}
                      margin="none"
                    >
                      {val["@value"]}
                    </Paragraph>
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
        error = false;
      }

      setState({
        graph: await jsonld.compact(res, res["@context"]),
        properties,
        members,
        error,
        // elements,
      });
    };
    init();
  }, [hypermedia, apiDoc]);
  if (!!!hypermedia) {
    return <Box background="light-1" pad="medium" width="large"></Box>;
  }
  // console.log('response: ', response);

  return (
    <Box background="light-1" pad="medium" fill="horizontal">

      <Heading level="4" fill>
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
            <Heading level="6" hidden={!state.error}>
              Recurso no encontrado
            </Heading>

            <Heading
              level="5"
              margin="none"
              hidden={state.properties.length <= 0}
            >
              Propiedades
            </Heading>

            <Box margin={{ top: "small" }}>
              <NameValueList>{state.properties}</NameValueList>
            </Box>

            <Heading level="5" margin="none" hidden={state.members.length <= 0}>
              Miembros de la colecci??n
            </Heading>
            <Box margin={{ top: "small" }}>{state.members}</Box>
          </Box>
          {
            // <Box height="medium">
            //   <Heading level="5" margin="none">
            //     Grafo
            //   </Heading>
            //   <ReactFlow elements={state.elements} />
            // </Box>
          }
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
                overflow="auto"
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
