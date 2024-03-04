import { Logger } from "pino";
import { JsonRpcPayload } from "@walletconnect/jsonrpc-types";

import { IClient } from "./client";

export declare namespace CryptoTypes {
  export interface Participant {
    publicKey: string;
  }

  export interface KeyPair {
    privateKey: string;
    publicKey: string;
  }

  export interface EncryptionKeys {
    sharedKey: string;
    publicKey: string;
    iv?: string;
  }

  export interface EncryptParams extends EncryptionKeys {
    message: string;
  }

  export interface DecryptParams {
    sharedKey: string;
    encrypted: string;
  }
}

export abstract class IKeyChain {
  public abstract keychain: Map<string, string>;

  public abstract name: string;

  public abstract readonly context: string;

  constructor(public client: IClient, public logger: Logger) {}

  public abstract init(): Promise<void>;

  public abstract has(tag: string, opts?: any): Promise<boolean>;

  public abstract set(tag: string, key: string, opts?: any): Promise<void>;

  public abstract get(tag: string, opts?: any): Promise<string>;

  public abstract del(tag: string, opts?: any): Promise<void>;
}

export abstract class ICrypto {
  public abstract name: string;

  public abstract readonly context: string;

  public abstract keychain: IKeyChain;

  constructor(public client: IClient, public logger: Logger, keychain?: IKeyChain) {}

  public abstract init(): Promise<void>;

  public abstract hasKeys(tag: string): Promise<boolean>;

  public abstract generateKeyPair(): Promise<string>;

  public abstract generateSharedKey(
    self: CryptoTypes.Participant,
    peer: CryptoTypes.Participant,
    overrideTopic?: string,
  ): Promise<string>;

  public abstract generateSymKey(overrideTopic?: string): Promise<string>;

  public abstract setSymKey(symKey: string, overrideTopic?: string): Promise<string>;

  public abstract deleteKeyPair(publicKey: string): Promise<void>;

  public abstract deleteSharedKey(topic: string): Promise<void>;

  public abstract deleteSymKey(topic: string): Promise<void>;

  public abstract encrypt(topic: string, message: string): Promise<string>;

  public abstract decrypt(topic: string, encrypted: string): Promise<string>;

  public abstract encode(topic: string, payload: JsonRpcPayload): Promise<string>;

  public abstract decode(topic: string, encrypted: string): Promise<JsonRpcPayload>;
}
