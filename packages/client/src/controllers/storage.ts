import { Logger } from "pino";
import { IKeyValueStorage } from "keyvaluestorage";
import { generateChildLogger, getLoggerContext } from "@walletconnect/logger";
import {
  IStorage,
  JsonRpcRecord,
  StorageKeyMap,
  SubscriberTypes,
  StorageConfig,
  IBaseStorage,
  IRelayerStorage,
  Expiration,
} from "@walletconnect/types";
import { ERROR, mapToObj, objToMap, formatStorageKeyName } from "@walletconnect/utils";

import { STORAGE_CONTEXT, STORAGE_KEYS, STORAGE_VERSION } from "../constants";

export class BaseStorage implements IBaseStorage {
  public name: string = STORAGE_CONTEXT;

  public version = STORAGE_VERSION;

  public keyMap: StorageKeyMap = STORAGE_KEYS;

  constructor(
    public logger: Logger,
    public keyValueStorage: IKeyValueStorage,
    public config: StorageConfig,
  ) {
    this.logger = generateChildLogger(logger, this.name);
    this.keyValueStorage = keyValueStorage;
    this.config = config;
  }

  get context(): string {
    return getLoggerContext(this.logger);
  }

  get prefix() {
    return `${this.config.protocol}@${this.config.version}:${this.config.context}:${this.version}`;
  }

  public getStorageKey(context: string): string {
    const name = this.getStorageKeyName(context);
    if (!this.isValidStorageKeyName(name)) {
      const error = ERROR.INVALID_STORAGE_KEY_NAME.format({ name });
      throw new Error(error.message);
    }
    const key = this.prefix + "//" + name;
    return key;
  }

  public getStorageKeyName(context: string): string {
    return formatStorageKeyName(context);
  }

  public isValidStorageKeyName(name: string): boolean {
    const validKeys = Object.keys(this.keyMap)
      .map(key => Object.values(this.keyMap[key]))
      .flat();
    return validKeys.includes(name.toLowerCase());
  }
}

export class RelayerStorage extends BaseStorage implements IRelayerStorage {
  constructor(
    public logger: Logger,
    public keyValueStorage: IKeyValueStorage,
    public config: StorageConfig,
  ) {
    super(logger, keyValueStorage, config);
  }

  public async setJsonRpcRecords(context: string, records: JsonRpcRecord[]): Promise<void> {
    const key = this.getStorageKey(context);
    await this.keyValueStorage.setItem<JsonRpcRecord[]>(key, records);
  }

  public async getJsonRpcRecords(context: string): Promise<JsonRpcRecord[] | undefined> {
    const key = this.getStorageKey(context);
    const records = await this.keyValueStorage.getItem<JsonRpcRecord[]>(key);
    return records;
  }

  public async setRelayerSubscriptions(
    context: string,
    subscriptions: SubscriberTypes.Active[],
  ): Promise<void> {
    const key = this.getStorageKey(context);
    await this.keyValueStorage.setItem<SubscriberTypes.Active[]>(key, subscriptions);
  }

  public async getRelayerSubscriptions(
    context: string,
  ): Promise<SubscriberTypes.Active[] | undefined> {
    const key = this.getStorageKey(context);
    const subscriptions = await this.keyValueStorage.getItem<SubscriberTypes.Active[]>(key);
    return subscriptions;
  }
}

export class Storage extends RelayerStorage implements IStorage {
  constructor(
    public logger: Logger,
    public keyValueStorage: IKeyValueStorage,
    public config: StorageConfig,
  ) {
    super(logger, keyValueStorage, config);
  }

  public async setKeyChain(context: string, keychain: Map<string, string>): Promise<void> {
    const key = this.getStorageKey(context);
    await this.keyValueStorage.setItem<Record<string, string>>(key, mapToObj(keychain));
  }

  public async getKeyChain(context: string): Promise<Map<string, string> | undefined> {
    const key = this.getStorageKey(context);
    const keychain = await this.keyValueStorage.getItem<Record<string, string>>(key);
    return typeof keychain !== "undefined" ? objToMap(keychain) : undefined;
  }

  public async setSequenceStore<Sequence = any>(
    context: string,
    sequences: Sequence[],
  ): Promise<void> {
    const key = this.getStorageKey(context);
    await this.keyValueStorage.setItem<Sequence[]>(key, sequences);
  }

  public async getSequenceStore<Sequence = any>(context: string): Promise<Sequence[] | undefined> {
    const key = this.getStorageKey(context);
    const sequences = await this.keyValueStorage.getItem<Sequence[]>(key);
    return sequences;
  }

  public async setExpirations(context: string, expirations: Expiration[]): Promise<void> {
    const key = this.getStorageKey(context);
    await this.keyValueStorage.setItem<Expiration[]>(key, expirations);
  }

  public async getExpirations(context: string): Promise<Expiration[] | undefined> {
    const key = this.getStorageKey(context);
    const expirations = await this.keyValueStorage.getItem<Expiration[]>(key);
    return expirations;
  }
}
