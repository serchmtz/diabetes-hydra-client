import { IClass } from "@hydra-cg/heracles.ts";
import { Box } from "grommet";
import React from "react";
import Cytoscape from "react-cytoscapejs";
export interface HydraGraphViewProps {
  hydraClass: IClass;
}

function generatePropertyNodes(
  hydraClass: IClass,
  elements: cytoscape.ElementDefinition[]
) {
  elements.push({
    data: { id: hydraClass.iri, label: hydraClass.displayName },
    classes: "hydraClass",
  });
  for (const prop of hydraClass.supportedProperties) {
    const propValueType = prop.property.valuesOfType.first().iri;
    const label = propValueType.replace(/.*#/, "");
    const id = prop.property.iri + propValueType;
    const isClass = prop.property.valuesOfType
      .first()
      .type.contains("http://www.w3.org/ns/hydra/core#Class");

    elements.push({
      data: {
        id: id,
        label: label,
      },
      classes: isClass ? "hydraClass" : "valueType",
    });
    elements.push({
      data: {
        id: prop.property.iri,
        source: hydraClass.iri,
        target: id,
        label: prop.property.displayName,
      },
    });
  }
}
const HydraGraphView: React.FC<HydraGraphViewProps> = ({ hydraClass }) => {
  const elements: cytoscape.ElementDefinition[] = [];

  generatePropertyNodes(hydraClass, elements);

  return (
    <Box>
      <Cytoscape
        style={{ width: "900px", height: "600px" }}
        elements={Cytoscape.normalizeElements(elements)}
        layout={{
          name: "cose",
          idealEdgeLength: () => 200,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: () => 800000,
          edgeElasticity: () => 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0,
        }}
        stylesheet={[
          {
            selector: "node.hydraClass",
            style: {
              shape: "ellipse",
              width: 100,
              height: 100,
              label: "data(label)",
              "font-size": "10px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#41729f",
              "text-outline-color": "#41729f",
              "text-outline-width": "1px",
              color: "#fff",
              "overlay-padding": "6px",
              "z-index": 10,
            },
          },
          {
            selector: "node.valueType",
            style: {
              shape: "ellipse",
              width: 75,
              height: 75,
              label: "data(label)",
              "font-size": "10px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#dadada",
              "text-outline-color": "#dadada",
              "text-outline-width": "1px",
              color: "#fff",
              "overlay-padding": "6px",
              "z-index": 10,
              "target-arrow-shape": "triangle",
            },
          },
          {
            selector: "edge",
            style: {
              "line-color": "#777",
              width: 5,
              label: "data(label)",
              "font-size": "10px",
              "text-background-opacity": 1,
              "text-background-shape": "rectangle",
              "text-background-color": "#fff",
              "text-background-padding": "1px",
              color: "#777",
            },
          },
        ]}
      />
    </Box>
  );
};

export default HydraGraphView;
