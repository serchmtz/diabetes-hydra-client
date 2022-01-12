import { IClass, ICollection, IResource } from "@hydra-cg/heracles.ts";
import { Card, CardHeader } from "grommet";
import { isHydraClass, isHydraCollection } from "../lib/utils";
import HydraClass from "./HydraClass";
import HydraCollection from "./HydraCollection";

interface Props {
  resource: IResource;
}

const HydraResource = ({ resource }: Props) => {
  // if (isHydraCollection(resource)) {
  //   return (
  //     <HydraClass hydraClass={resource as IClass}>
  //       <HydraCollection hydraCollection={resource as ICollection} />
  //     </HydraClass>
  //   );
  // } else
  console.log(resource);
  if (isHydraClass(resource)) {
    return <HydraClass hydraClass={resource as IClass} />;
  } else {
    return (
      <Card>
        <CardHeader>Hello</CardHeader>
      </Card>
    );
  }
};
export default HydraResource;
