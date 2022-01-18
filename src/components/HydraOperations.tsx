import { useEffect, useState } from "react";
import { useHydra } from "../lib/HydraContext";
import { IClass, IOperation, IResource } from "@hydra-cg/heracles.ts";
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

interface Props {
  iri: string;
  onCancelClicked: () => void;
}

const HydraOperations: React.FC<Props> = ({ iri, onCancelClicked }) => {
  const [target, setTarget] =
    useState<{ hydraClass: IClass; resource: IResource }>();
  const [operation, setOperation] = useState<IOperation>();
  const { apiDoc, hydraClient, setEndpoint } = useHydra();

  const handleInvoke = async (operation: IOperation, target: IResource) => {
    const newOp = { ...operation, target: target };
    const resp = await hydraClient.invoke(
      newOp,
      newOp.method !== "GET" ? target : undefined
    );
    const hypermediaProcessor = hydraClient.getHypermediaProcessor(resp);
    const hyp = await hypermediaProcessor.process(resp, hydraClient);
    onCancelClicked();
    setEndpoint(hyp.iri, hyp);
  };

  useEffect(() => {
    if (apiDoc) {
      const getHydraClass = async () => {
        const hresource = await hydraClient.getResource(iri);
        const hclass = apiDoc.supportedClasses
          .ofIri(hresource.type.first())
          .first();
        setTarget({ hydraClass: hclass, resource: hresource });
      };
      getHydraClass();
    }
  }, [apiDoc, hydraClient, iri]);
  return target ? (
    <Card width="100%">
      <CardHeader background="light-1" pad="small">
        <Heading
          level="4"
          margin={{ bottom: "small", left: "none", top: "none" }}
        >
          Invocar una operación
        </Heading>
      </CardHeader>
      <CardBody pad="small">
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
            if (operation) {
              handleInvoke(operation, target.resource);
            }
          }}
        />
      </CardFooter>
    </Card>
  ) : (
    <></>
  );
};

export default HydraOperations;
