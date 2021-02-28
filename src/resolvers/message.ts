import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Message } from '../entity/Message';
import { MyContext } from '../types';
import { UserActivity } from 'src/entity/UserActivity';

@Resolver()
export class MessageResolver {
  @Query(() => [[Message]])
  getAllMessagesForUser(@Ctx() { user }: MyContext): Promise<Message[][]> {
    return UserActivity.find({
      relations: ['activity', 'activity.messageConnections'],
      where: { user }
    }).then((userActivities) =>
      userActivities.map(
        (userActivity) => userActivity.activity.messageConnections
      )
    );
  }

  @Mutation(() => Message)
  async createMessage(
    @Ctx() { user }: MyContext,
    @Arg('message') message: string
  ): Promise<Message> {
    const msg = Message.create({ sender: user, message });
    return msg.save();
  }
}
