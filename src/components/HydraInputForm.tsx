// import { useState } from "react";
import { IClass, ISupportedProperty } from "@hydra-cg/heracles.ts";
import {
  Box,
  Form,
  FormField,
  TextInput,
  Text,
  FormExtendedEvent,
} from "grommet";

export type BodyType = Object & { [k in string]: any };

interface Props {
  ref?: React.LegacyRef<HTMLFormElement>;
  expects: IClass | null;
  onChange?: (body: BodyType) => void;
  onSubmit?: (event: FormExtendedEvent<{}, Element>) => void;
  onValidate?: (validationResults: {
    errors: Record<string, any>;
    infos: Record<string, any>;
    valid: boolean;
  }) => void;
}

function generateInputField(
  supportedProperty: ISupportedProperty,
  key: number
) {
  const valueTypes = supportedProperty.property.valuesOfType;
  if (
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#dateTime").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#date").any()
  ) {
    return (
      <FormField
        key={key}
        name={supportedProperty.property.iri}
        label={
          <Text size="xsmall">{supportedProperty.property.displayName}</Text>
        }
        htmlFor={supportedProperty.property.iri}
        required={supportedProperty.required}
      >
        <TextInput
          type="date"
          id={supportedProperty.property.iri}
          name={supportedProperty.property.iri}
          placeholder={valueTypes.nonBlank().first().iri}
          size="xsmall"
        />
      </FormField>
    );
  }

  if (
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#float").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#double").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#decimal").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#integer").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#int").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#long").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#short").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#byte").any()
  ) {
    return (
      <FormField
        type="number"
        key={key}
        name={supportedProperty.property.iri}
        label={
          <Text size="xsmall">{supportedProperty.property.displayName}</Text>
        }
        htmlFor={supportedProperty.property.iri}
        required={supportedProperty.required}
      >
        <TextInput
          type="number"
          id={supportedProperty.property.iri}
          name={supportedProperty.property.iri}
          placeholder={valueTypes.nonBlank().first().iri}
          size="xsmall"
        />
      </FormField>
    );
  }

  if (valueTypes.ofType("http://www.w3.org/ns/hydra/core#Class").any()) {
    return (
      <FormField
        key={key}
        name={supportedProperty.property.iri}
        label={
          <Text size="xsmall">{supportedProperty.property.displayName}</Text>
        }
        htmlFor={supportedProperty.property.iri}
        required={supportedProperty.required}
        validate={[
          { regexp: /.*[://]*.*/, status: "error", message: "Formato incorrecto" },
        ]}
      >
        <TextInput
          type="url"
          id={supportedProperty.property.iri}
          name={supportedProperty.property.iri}
          placeholder={valueTypes.nonBlank().first().iri}
          size="xsmall"
        />
      </FormField>
    );
  }

  return (
    <FormField
      key={key}
      name={supportedProperty.property.iri}
      label={
        <Text size="xsmall">{supportedProperty.property.displayName}</Text>
      }
      htmlFor={supportedProperty.property.iri}
      required={supportedProperty.required}      
    >
      <TextInput
        id={supportedProperty.property.iri}
        name={supportedProperty.property.iri}
        placeholder={valueTypes.nonBlank().first().iri}
        size="xsmall"
      />
    </FormField>
  );
}

function objectToHydraPayload(body: BodyType, hydraClass: IClass) {
  let newBody = { ...body };
  const supprops = hydraClass.supportedProperties;
  for (const prop of supprops) {
    if (
      prop.property.valuesOfType
        .ofType("http://www.w3.org/ns/hydra/core#Class")
        .any() &&
      newBody.hasOwnProperty(prop.property.iri)
    ) {
      if (newBody[prop.property.iri] === "") {
        delete newBody[prop.property.iri];
        continue;
      }
      newBody[prop.property.iri] = {
        "@id": newBody[prop.property.iri],
        "@type": prop.property.valuesOfType.first().iri,
      };
    }
  }
  return newBody;
}

const HydraInputForm: React.FC<Props> = ({
  expects,
  onChange,
  onSubmit,
  children,
  onValidate,
  ref,
}) => {
  if (!expects) return <></>;

  // console.log("expects: ", expects);
  return (
    <Box overflow="auto" height={{ max: "small" }}>
      <Form
        ref={ref}
        // onReset={() => setBody({})}
        onSubmit={onSubmit}
        validate="change"
        onValidate={onValidate}
        onChange={(next) => {
          if (onChange) {
            console.log('next: ', next);
            onChange(objectToHydraPayload(next, expects));
          }
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
        {expects.supportedProperties
          .toArray()
          .map((prop, i) => generateInputField(prop, i))}
      </Form>
      {children}
    </Box>
  );
};

export default HydraInputForm;
