import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateMessageInput {
  @Field() user: String;

  @Field() content: String;
}
