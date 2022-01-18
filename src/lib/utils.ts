import { IResource, hydra } from "@hydra-cg/heracles.ts";

export function isHydraClass(resource: IResource) {
  return resource.type.contains(hydra.Class);
}

export function isHydraCollection(resource: IResource) {
  return resource.type.contains(hydra.Collection);
}

export function isHydraLink(resource: IResource) {
  return resource.type.contains(hydra.Link);
}

export function isHydraSupportedProperty(resource: IResource) {
  return resource.type.contains(hydra.SupportedProperty);
}
