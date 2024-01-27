import { createPubSub } from 'graphql-yoga';
import { Message } from '../models/chat.model';
export const enum Topic {
  CHAT = 'CHAT',
}

export type PubSubPayloads = {
  [Topic.CHAT]: [Message];
} & Record<string, [Message]>;

export const pubSub = createPubSub<PubSubPayloads>();
