import { Arg, FieldResolver, Mutation, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Conversation, Message } from '../models/chat.model';
import { Topic, pubSub } from './pub-sub';

const inMemoryConversations: Record<string, Conversation> = {};

const inMemoryMessages: Record<string, Message[]> = {};

@Resolver()
export class ChatResolver {
  constructor() {
    const userNames = ['Emily', 'Jacob', 'Sophia', 'Liam', 'Olivia', 'David', 'Zhang'];

    userNames.forEach((item) => {
      const id = getNewConversationId();

      inMemoryConversations[id] = {
        id,
        name: item,
        createdAt: new Date(),
      };

      inMemoryMessages[id] = [];
    });
  }

  @Query(() => [Conversation])
  public async conversationsList(): Promise<Conversation[]> {
    console.log('calling conversationsList');

    return Object.values(inMemoryConversations);
  }

  @Query(() => Conversation)
  public async conversationById(@Arg('id') id: string) {
    console.log('calling conversationById', { id });

    return inMemoryConversations[id];
  }

  @Mutation(() => Conversation)
  public async conversationCreate(
    @Arg('senderId') senderId: string,
    @Arg('name') name: string,
    @Arg('message') message: string,
  ) {
    console.log('calling conversationCreate', { name, message, senderId });

    const conversationId = getNewConversationId();

    const newConversation = new Conversation({
      name,
      id: conversationId,
    });

    inMemoryMessages[newConversation.id] = [
      new Message({
        id: getNewMessageId(),
        senderId,
        conversationId: newConversation.id,
        content: message,
      }),
    ];

    inMemoryConversations[newConversation.id] = newConversation;

    return newConversation;
  }

  @Mutation(() => Message)
  public async messageCreate(
    @Arg('conversationId') conversationId: string,
    @Arg('senderId') senderId: string,
    @Arg('content') content: string,
  ) {
    console.log('calling messageCreate', { conversationId, content, senderId });

    if (!inMemoryConversations[conversationId]) {
      throw new Error('Conversation not found');
    }

    const newMessage = new Message({
      id: getNewMessageId(),
      conversationId,
      senderId,
      content,
    });

    inMemoryMessages[conversationId].push(newMessage);

    pubSub.publish(Topic.CHAT, newMessage);

    return newMessage;
  }

  @Subscription(() => Message, {
    topics: Topic.CHAT,
    filter: (props) => {
      const conversationId = props?.args?.conversationId;
      const find = inMemoryConversations[conversationId];
      console.log('filter', { conversationId, find });

      return !!find;
    },
  })
  public onNewMessageSent(@Root() payload: Message, @Arg('conversationId') conversationId: string) {
    console.log('calling onNewMessageSent', { conversationId, payload });
    return payload;
  }
}

@Resolver(() => Conversation)
export class ConversationResolver {
  @FieldResolver(() => [Message])
  public async messages(@Root() conversation: Conversation) {
    return inMemoryMessages[conversation.id] || [];
  }

  @FieldResolver(() => Message, { nullable: true })
  public async lastMessage(@Root() conversation: Conversation) {
    const items = inMemoryMessages[conversation.id];

    if (!items) {
      return null;
    }

    return items[items.length - 1];
  }
}

function getNewConversationId() {
  return `conversation_${Object.values(inMemoryConversations).length + 1}`;
}

function getNewMessageId() {
  return `message_${Object.values(inMemoryMessages).length + 1}`;
}
