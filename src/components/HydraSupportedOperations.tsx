import {
  IOperation,
  OperationsCollection,
} from "@hydra-cg/heracles.ts";
import { Box, Heading, Menu, Text } from "grommet";
import { useState } from "react";
import HydraOperation from "./HydraOperation";

interface Props {
  supportedOperations: OperationsCollection;
  onOperationSelected: (operation: IOperation) => void;
}

const HydraSupportedOperations: React.FC<Props> = ({
  supportedOperations,
  onOperationSelected,
  children,
}) => {
  const [operation, setOperation] = useState<IOperation>();
  const menuItems = supportedOperations.toArray().map((op) => {
    return {
      label: (
        <Box direction="row">
          <Box
            background="brand"
            round="xxsmall"
            pad="xsmall"
            width="3em"
            align="center"
          >
            <Text size="8pt">{op.method}</Text>
          </Box>
          <Text margin={{ left: "small" }} weight="bold">
            {(op as any).displayName}
          </Text>
        </Box>
      ),
      onClick: () => {
        onOperationSelected(op);
        setOperation(op);
      },
    };
  });

  return (
    <Box
      pad="medium"
      width={{ min: "large" }}
      height={{ min: "small", max: "large" }}
    >
      <Heading margin={{ bottom: "small", top: "none" }} level="4">
        Operaciones soportadas
      </Heading>
      <Menu
        label={operation ? `Método ${operation.method}` : "Método HTTP"}
        items={menuItems}
      />
      {operation && <HydraOperation operation={operation} />}
      {children}
    </Box>
  );
};

export default HydraSupportedOperations;
