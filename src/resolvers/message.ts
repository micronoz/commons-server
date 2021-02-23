import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Message } from '../entity/Message';
import { MyContext } from '../types';
import { Activity } from '../entity/Activity';

@Resolver()
export class MessageResolver {
  @Query(() => [Message])
  getAllMessagesForUser(@Ctx() { user }: MyContext): Promise<Message[]> {
    return Message.find({ user });
  }

  @Mutation(() => Message)
  async createMessage(
    @Ctx() { user }: MyContext,
    @Arg('message') message: string,
    @Arg('activityId') activityId: string
  ): Promise<Message> {
    const activity = await Activity.findOneOrFail({ id: activityId });
    const msg = Message.create({ user, message, activity });
    return msg.save();
  }
}
