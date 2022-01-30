import { useEffect, useRef, useState } from "react";
import { useHydra } from "../lib/HydraContext";
import {
  IClass,
  IHypermediaContainer,
  IOperation,
} from "@hydra-cg/heracles.ts";

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  CardFooter,
  Button,
} from "grommet";
import HydraSupportedOperations from "./HydraSupportedOperations";
import HydraInputForm from "./HydraInputForm";
import jsonld from "jsonld";

interface Props {
  iri: string;
  onCancelClicked: () => void;
}
interface Target {
  hydraClass: IClass;
  resource: IHypermediaContainer;
}
export type BodyType = Object & { [k in string]: any };

function objectToHydraPayload(body: BodyType, hydraClass: IClass) {
  let newBody = { ...body };
  const supprops = hydraClass.supportedProperties;
  for (const prop of supprops) {
    const valueTypes = prop.property.valuesOfType;
    // console.log("valueTypes: ", valueTypes);
    if (newBody.hasOwnProperty(prop.property.iri)) {
      if (newBody[prop.property.iri] === "") {
        delete newBody[prop.property.iri];
        continue;
      }

      if (valueTypes.ofType("http://www.w3.org/ns/hydra/core#Class").any()) {
        newBody[prop.property.iri] = {
          "@id": newBody[prop.property.iri],
          "@type": prop.property.valuesOfType.first().iri,
        };
        continue;
      }

      if (
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#float").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#double").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#decimal").any()
      ) {
        // Ensure number is decimal
        const parsedFloat = parseFloat(newBody[prop.property.iri]);
        newBody[prop.property.iri] =
          parsedFloat % 1 === 0 ? parsedFloat + 1e-15 : parsedFloat;

        continue;
      }

      if (
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#integer").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#int").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#long").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#short").any() ||
        valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#byte").any()
      ) {
        newBody[prop.property.iri] = parseInt(newBody[prop.property.iri]);
        continue;
      }
    }
  }
  return newBody;
}

const HydraOperations: React.FC<Props> = ({ iri, onCancelClicked }) => {
  const [operation, setOperation] = useState<IOperation | null>(null);
  const [target, setTarget] = useState<Target | null | undefined>(undefined);
  // const [isValid, setIsValid] = useState(true);
  const loading = useRef(true);

  const { apiDoc, hydraClient, setEndpoint, entryPoint } = useHydra();

  const handleInvoke = async (
    operation: IOperation,
    target: Target,
    body?: object
  ) => {
    let newBody = body;
    if (body !== undefined) {
      newBody = objectToHydraPayload(body, operation.expects.first());
    }

    const newOp = { ...operation, target: target.resource };
    const resp = await hydraClient.invoke(
      newOp,
      newOp.method !== "GET"
        ? {
            ...newBody,
            iri: ":",
            type: target.hydraClass.type,
          }
        : undefined
    );
    const hypermediaProcessor = hydraClient.getHypermediaProcessor(resp);
    const hyp = await hypermediaProcessor.process(resp, hydraClient);
    const json = await jsonld.expand(await hyp.json());
    // console.log("hyp: ", hyp);
    onCancelClicked();
    if (json[0]) {
      setEndpoint(json[0]["@id"] || resp.url);
    } else if (entryPoint) {
      setEndpoint(entryPoint.url);
    }
  };

  useEffect(() => {
    if (apiDoc) {
      const getHydraClass = async () => {
        const hresource = await hydraClient.getResource(iri);
        const htype = hresource.type.first();
        loading.current = false;
        if (htype) {
          const hclass = apiDoc.supportedClasses.ofIri(htype).first();
          setTarget({ hydraClass: hclass, resource: hresource });
        } else {
          setTarget(null);
        }
      };
      getHydraClass();
    }
  }, [apiDoc, hydraClient, iri]);

  return (
    <Card width="100%">
      <CardHeader background="light-1" pad="small">
        <Heading level="4" margin="none">
          Invocar una operación
        </Heading>
      </CardHeader>
      <CardBody pad="medium" gap="small" height="medium">
        {!!target ? (
          <>
            <Text size="12pt" weight="bold">
              {`Objetivo: ${iri}`}
            </Text>
            <Text
              size="10pt"
              color="dark-3"
            >{`@type: ${target.hydraClass.iri}`}</Text>
            <HydraSupportedOperations
              onOperationSelected={(operation) => {
                setOperation(operation);
              }}
              supportedOperations={target.hydraClass.supportedOperations}
            />
            {!!operation && (
              <HydraInputForm
                id="hydra-form"
                expects={operation.expects.first()}
                // onValidate={({ valid }) => {
                //   console.log("valid: ", valid);
                //   setIsValid(valid);
                // }}
                onSubmit={(e) => {
                  // console.log("e: ", e);
                  // console.log("e.value: ", e.value);
                  if (!!operation && !!target) {
                    handleInvoke(operation, target, e.value);
                  }
                }}
              />
            )}
          </>
        ) : (
          <Text size="14pt">
            {loading.current ? "Cargando..." : "No hay operaciones"}
          </Text>
        )}
      </CardBody>
      <CardFooter justify="end" round="none" gap="small" pad="medium">
        <Button label="Cancelar" secondary onClick={onCancelClicked} />
        <Button
          label="Invocar"
          // disabled={operation?.method === "GET" ? false : !isValid}
          primary
          type="submit"
          form="hydra-form"
        />
      </CardFooter>
    </Card>
  );
};

export default HydraOperations;
