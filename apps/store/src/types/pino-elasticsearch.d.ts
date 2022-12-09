declare module 'pino-elasticsearch' {
    import { DestinationStream } from 'pino';
    import { ConnectionOptions as TlsConnectionOptions } from 'tls';
    import Connection, {
      AgentOptions,
    } from '@elastic/elasticsearch/lib/Connection';
    import {
      BasicAuth,
      ApiKeyAuth,
      BearerAuth,
    } from '@elastic/elasticsearch/lib/pool';
  
    type DynamicIndexFunction = (logTime: string) => string;
  
    type NodeOptions = {
      url: URL;
      id?: string;
      agent?: AgentOptions;
      ssl?: TlsConnectionOptions;
      headers?: Record<string, any>;
      roles?: {
        master: boolean;
        data: boolean;
        ingest: boolean;
        ml: boolean;
      };
    };
  
    export type Options = {
      index?: DynamicIndexFunction | string;
      op_type?: string;
      'es-version'?: number;
      'flush-bytes'?: number;
      node?: NodeOptions | NodeOptions[] | string[] | string;
      auth?: ApiKeyAuth | BasicAuth | BearerAuth;
      cloud?: {
        id: string;
        // TODO: remove username and password here in 8
        username?: string;
        password?: string;
      };
      ssl?: TlsConnectionOptions;
      Connection?: typeof Connection;
    };
  
    export default function pinoElasticSearch(opts: Options): DestinationStream;
  }