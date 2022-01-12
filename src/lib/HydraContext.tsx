import { useContext, createContext, useEffect, useState } from "react";
import HydraClientFactory, {
  IHydraClient,
  IApiDocumentation,
  IHypermediaContainer,
  IClass,
} from "@hydra-cg/heracles.ts";

const hydraClient = HydraClientFactory.configure()
  .withDefaults()
  .withAllLinks()
  .andCreate();

const getApiDoc = async (endpoint: string) => {
  return await hydraClient.getApiDocumentation(endpoint);
};

interface HydraContextData {
  loading: boolean;
  hydraClient: IHydraClient;
  apiDoc: IApiDocumentation | null;
  hypermedia: IHypermediaContainer | null;
  entryPoint: IHypermediaContainer | null;
  setHypermedia: (hypermedia: IHypermediaContainer | null) => void;
  hydraClass: IClass | null;
  setClass: (hydraClass: IClass | null) => void;
  endpoint: string;
  setEndpoint: (iri: string) => Promise<void>;
}

const defaultContextValue: HydraContextData = {
  loading: true,
  hydraClient: hydraClient,
  apiDoc: null,
  hypermedia: null,
  entryPoint: null,
  setHypermedia: (_hypermedia) => {},
  hydraClass: null,
  setClass: (_hydraClass) => {},
  endpoint: process.env.ENDPOINT || "http://localhost:8080/api",
  setEndpoint: async (_iri) => {},
};

export const HydraContext =
  createContext<HydraContextData>(defaultContextValue);

export const useHydra = () => {
  return useContext(HydraContext);
};

interface Props {}
export const HydraProvider: React.FC<Props> = ({ children }) => {
  const [value, setValue] = useState<HydraContextData>(defaultContextValue);

  useEffect(() => {
    const retrieveDefaultValue = async () => {
      try {
        const apiDoc = await getApiDoc(
          process.env.ENDPOINT || "http://localhost:8080/api"
        );
        const entryPoint = await apiDoc.getEntryPoint();
        const hydraClass = apiDoc.supportedClasses
          .ofIri(entryPoint.type.first())
          .first();
        const setHypermedia = (hypermedia: IHypermediaContainer | null) => {
          setValue((v) => {
            return { ...v, hypermedia: hypermedia };
          });
        };
        const setClass = (hydraClass: IClass | null) => {
          setValue((v) => {
            return { ...v, hydraClass: hydraClass };
          });
        };
        const setEndpoint = async (iri: string) => {
          console.log("setEndpoint called");
          try {
            const hypermedia = await hydraClient.getResource(iri);
            const htype = hypermedia.type.first();
            const hydraClass = apiDoc.supportedClasses.ofIri(htype).first();
            setValue((v) => {
              return {
                ...v,
                hypermedia: hypermedia,
                hydraClass: hydraClass,
                endpoint: iri,
              };
            });
          } catch (err) {
            console.error(err);
            setValue(defaultContextValue);
          }
        };
        setValue((v) => {
          return {
            ...v,
            apiDoc: apiDoc,
            entryPoint: entryPoint,
            hypermedia: entryPoint,
            hydraClass: hydraClass,
            setHypermedia: setHypermedia,
            setClass: setClass,
            loading: false,
            setEndpoint: setEndpoint,
          };
        });
      } catch (err) {
        console.log(err);
        setValue(defaultContextValue);
      }
    };
    retrieveDefaultValue();
  }, []);

  return (
    <HydraContext.Provider value={value}>{children}</HydraContext.Provider>
  );
};
