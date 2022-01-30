import { useRef } from "react";
import {
  IClass,
  ISupportedProperty,
  ResourceFilterableCollection,
  IResource,
} from "@hydra-cg/heracles.ts";
import {
  Box,
  Form,
  FormField,
  TextInput,
  Text,
  FormExtendedEvent,
} from "grommet";

interface Props {
  id?: string;
  ref?: React.LegacyRef<HTMLFormElement>;
  expects: IClass | null;
  onChange?: (body: object) => void;
  onSubmit?: (event: FormExtendedEvent<{}, Element>) => void;
  onValidate?: (validationResults: {
    errors: Record<string, any>;
    infos: Record<string, any>;
    valid: boolean;
  }) => void;
}
interface InputTypeReturn {
  inputType: "url" | "date" | "number" | "text";
  step?: string;
}
function valueTypestoInputType(
  valueTypes: ResourceFilterableCollection<IResource>
): InputTypeReturn {
  if (valueTypes.ofType("http://www.w3.org/ns/hydra/core#Class").any()) {
    return { inputType: "url" };
  }
  if (
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#dateTime").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#date").any()
  ) {
    return { inputType: "date" };
  }
  if (
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#float").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#double").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#decimal").any()
  ) {
    return { inputType: "number", step: "0.1" };
  }

  if (
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#integer").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#int").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#long").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#short").any() ||
    valueTypes.ofIri("http://www.w3.org/2001/XMLSchema#byte").any()
  ) {
    return { inputType: "number", step: "1" };
  }

  return { inputType: "text" };
}

function generateInputField(
  supportedProperty: ISupportedProperty,
  key: number
) {
  const valueTypes = supportedProperty.property.valuesOfType;
  const baseName = supportedProperty.property.displayName;
  const id = supportedProperty.property.iri;
  const required = supportedProperty.required;
  const placeholder = valueTypes.nonBlank().first().iri;
  const { inputType, step } = valueTypestoInputType(valueTypes);

  return (
    <FormField
      key={key}
      label={<Text size="xsmall">{baseName}</Text>}
      htmlFor={id}
      required={required}
    >
      <TextInput
        id={id}
        name={id}
        placeholder={placeholder}
        size="xsmall"
        type={inputType}
        step={step}
      />
    </FormField>
  );
}
const HydraInputForm: React.FC<Props> = ({
  expects,
  onChange,
  onSubmit,
  children,
  onValidate,
  ref,
  id,
}) => {
  const valueRef = useRef({ "@type": expects?.iri });
  if (!expects) return null;
  const inputFields = expects.supportedProperties
    .toArray()
    .map((prop, i) => generateInputField(prop, i));

  // console.log("expects: ", expects);
  return (
    <Box overflow="auto" height={{ max: "small" }}>
      <Form
        value={valueRef.current}
        id={id}
        ref={ref}
        onValidate={onValidate}
        validate="submit"
        onSubmit={(e) =>
          !!onSubmit && onSubmit({ ...e, value: valueRef.current })
        }
        onChange={(next) => {
          valueRef.current = { ...valueRef.current, ...next };
          if (!!onChange) onChange(valueRef.current);
        }}
      >
        {inputFields}
        {children}
      </Form>
    </Box>
  );
};

export default HydraInputForm;
