import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Activity } from '../entity/Activity';

@Resolver()
export class ActivityResolver {
  @Query(() => Activity, { nullable: true })
  activity(@Arg('id') id: string): Promise<Activity> {
    return Activity.findOneOrFail({ id });
  }

  @Query(() => [Activity])
  activities(): Promise<Activity[]> {
    return Activity.find();
  }

  @Mutation(() => Activity)
  async createActivity(@Arg('title') title: string): Promise<Activity> {
    const activity = Activity.create({ title });
    await activity.save();
    return activity;
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Arg('id') id: string,
    @Arg('title', { nullable: true }) title: string
  ): Promise<Activity> {
    const activity = await Activity.findOneOrFail({ id });
    activity.title = title;
    await activity.save();
    return activity;
  }

  @Mutation(() => Boolean)
  async deleteActivity(@Arg('id') id: string): Promise<boolean> {
    try {
      Activity.delete({ id });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllActivities(): Promise<boolean> {
    try {
      Activity.clear();
      return true;
    } catch {
      return false;
    }
  }
}
