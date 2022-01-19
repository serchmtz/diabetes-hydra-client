// import { useState } from "react";
import { IClass } from "@hydra-cg/heracles.ts";
import { Box, Form, FormField, TextInput } from "grommet";
interface Props {
  expects: IClass | null;
  onBodyChange: (body: object) => void;
}

const HydraInputForm: React.FC<Props> = ({
  expects,
  onBodyChange,
  children,
}) => {
  if (!expects) return <></>;
  return (
    <Box overflow="auto" height={{ max: "small" }}>
      <Form
        // onReset={() => setBody({})}
        // onSubmit={() => {}}
        onChange={(next) => {
          onBodyChange(next);
          // setBody(next);
        }}
      >
        {expects && (
          <FormField hidden>
            <TextInput
              id={"@type"}
              name={"@type"}
              value={expects.iri}
              disabled
              hidden
            />
          </FormField>
        )}
        {expects.supportedProperties.toArray().map((prop, i) => (
          <FormField
            key={i}
            name={prop.property.iri}
            label={prop.property.displayName}
            htmlFor={prop.property.iri}
          >
            <TextInput id={prop.property.iri} name={prop.property.iri} />
          </FormField>
        ))}
      </Form>
      {children}
    </Box>
  );
};

export default HydraInputForm;
