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
const HydraOperations: React.FC<Props> = ({ iri, onCancelClicked }) => {
  const [target, setTarget] = useState<Target | null | undefined>(undefined);
  const [operation, setOperation] = useState<IOperation>();
  const loading = useRef(true);
  // const [body, setBody] = useState<object>();
  const body = useRef<object>();
  const { apiDoc, hydraClient, setEndpoint, entryPoint } = useHydra();

  const handleInvoke = async (
    operation: IOperation,
    target: Target,
    body?: object
  ) => {
    const newOp = { ...operation, target: target.resource };
    const resp = await hydraClient.invoke(
      newOp,
      newOp.method !== "GET"
        ? {
            ...body,
            iri: ":",
            type: target.hydraClass.type,
          }
        : undefined
    );
    const hypermediaProcessor = hydraClient.getHypermediaProcessor(resp);
    const hyp = await hypermediaProcessor.process(resp, hydraClient);
    const json = await jsonld.expand(await hyp.json());
    console.log("hyp: ", hyp);
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
              onOperationSelected={(operation) => setOperation(operation)}
              supportedOperations={target.hydraClass.supportedOperations}
            />
            {operation && (
              <HydraInputForm
                expects={operation.expects.first()}
                onBodyChange={(nextBody) => {
                  // console.log("nextBody: ", nextBody);
                  body.current = nextBody;
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
        <Button
          label="Cancelar"
          secondary
          onClick={(e) => {
            e.preventDefault();
            onCancelClicked();
          }}
        />
        <Button
          label="Invocar"
          primary
          disabled={operation ? false : true}
          onClick={(e) => {
            e.preventDefault();
            if (!!operation && !!target) {
              handleInvoke(operation, target, body.current);
            }
          }}
        />
      </CardFooter>
    </Card>
  );
};

export default HydraOperations;
