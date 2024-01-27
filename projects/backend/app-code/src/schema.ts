import { buildSchema } from 'type-graphql';
import { MessageResolver } from './graphql/resolvers';
import { pubSub } from './graphql/resolvers/pub-sub';
import { ChatResolver, ConversationResolver } from './graphql/resolvers/chat.resolver';

export async function getSchema() {
  return buildSchema({
    pubSub,
    validate: { forbidUnknownValues: false },
    resolvers: [ChatResolver, ConversationResolver],
  });
}
