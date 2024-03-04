import { Logger } from "pino";
import { IEvents } from "@walletconnect/events";

import { IRelayer, RelayerTypes } from "./relayer";

export declare namespace PublisherTypes {
  export interface Params {
    topic: string;
    message: string;
    opts: Required<RelayerTypes.PublishOptions>;
  }
}

export abstract class IPublisher extends IEvents {
  public abstract name: string;

  public abstract readonly context: string;

  constructor(public relayer: IRelayer, public logger: Logger) {
    super();
  }

  public abstract publish(
    topic: string,
    message: string,
    opts?: RelayerTypes.PublishOptions,
  ): Promise<void>;
}
