import { Logger } from "pino";
import { IKeyValueStorage, KeyValueStorageOptions } from "keyvaluestorage";
import { IJsonRpcProvider, JsonRpcPayload, IEvents } from "@walletconnect/jsonrpc-types";

import { IRelayerStorage } from "./storage";
import { ISubscriber } from "./subscriber";
import { IJsonRpcHistory } from "./history";
import { IHeartBeat } from "./heartbeat";
import { IPublisher } from "./publisher";

export declare namespace RelayerTypes {
  export interface ProtocolOptions {
    protocol: string;
    params?: any;
  }

  export interface PublishOptions {
    relay: ProtocolOptions;
    ttl?: number;
  }

  export interface SubscribeOptions {
    relay: ProtocolOptions;
  }

  export interface UnsubscribeOptions {
    id?: string;
    relay: ProtocolOptions;
  }

  export type RequestOptions = PublishOptions | SubscribeOptions | UnsubscribeOptions;

  export interface PayloadEvent {
    topic: string;
    payload: JsonRpcPayload;
  }
}

export abstract class IRelayerEncoder {
  public abstract encode(
    topic: string,
    payload: JsonRpcPayload,
    nonce?: number | string,
  ): Promise<string>;

  public abstract decode(
    topic: string,
    encrypted: string,
    nonce?: number | string,
  ): Promise<JsonRpcPayload>;
}

export interface RelayerOptions {
  heartbeat?: IHeartBeat;
  encoder?: IRelayerEncoder;
  storage?: IRelayerStorage;
  keyValueStorage?: IKeyValueStorage;
  keyValueStorageOptions?: KeyValueStorageOptions;
  logger?: string | Logger;
  rpcUrl?: string;
  projectId?: string;
  relayProvider?: string | IJsonRpcProvider;
}

export abstract class IRelayer extends IEvents {
  public abstract logger: Logger;

  public abstract storage: IRelayerStorage;

  public abstract heartbeat: IHeartBeat;

  public abstract encoder: IRelayerEncoder;

  public abstract subscriber: ISubscriber;

  public abstract publisher: IPublisher;

  public abstract history: IJsonRpcHistory;

  public abstract provider: IJsonRpcProvider;

  public abstract name: string;

  public abstract readonly context: string;

  public abstract readonly connected: boolean;

  public abstract readonly connecting: boolean;

  constructor(opts?: RelayerOptions) {
    super();
  }

  public abstract init(): Promise<void>;

  public abstract publish(
    topic: string,
    payload: JsonRpcPayload,
    opts?: RelayerTypes.PublishOptions,
  ): Promise<void>;

  public abstract subscribe(topic: string, opts?: RelayerTypes.SubscribeOptions): Promise<string>;

  public abstract unsubscribe(topic: string, opts?: RelayerTypes.UnsubscribeOptions): Promise<void>;
}
