import { Resolver, Ctx, Mutation, Arg } from 'type-graphql';
import { Message } from '../entity/Message';
import { MyContext } from '../types';
import { UserActivity } from '../entity/UserActivity';
import { Activity } from '../entity/Activity';
import { ApolloError } from 'apollo-server-express';
import { FindOperator } from 'typeorm';

@Resolver()
export class MessageResolver {
  @Mutation(() => Message)
  async createMessage(
    @Ctx() { getUser }: MyContext,
    @Arg('activityId') activityId: string,
    @Arg('message') message: string
  ): Promise<Message> {
    const user = await getUser();
    var activity: Promise<Activity>;
    try {
      activity = Activity.findOneOrFail({
        id: activityId
      });
      await UserActivity.findOneOrFail({
        where: {
          activity: await activity,
          user: user,
          attendanceStatus: 1
        }
      });
    } catch (e) {
      console.error(e);
      throw new ApolloError(
        'Cannot post message to this activity because either it does not exist or you are not a member.'
      );
    }
    const msg = Message.create({ message });
    msg.sender = Promise.resolve(user);
    msg.activity = activity;
    return await msg.save();
  }
}
