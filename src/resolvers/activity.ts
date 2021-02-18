import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Activity } from '../entity/Activity';
import { MyContext } from '../types';

@Resolver()
export class ActivityResolver {
  @Query(() => Activity, { nullable: true })
  activity(@Arg('id') id: number, @Ctx() { em }: MyContext): Promise<Activity> {
    return em.findOneOrFail(Activity, id);
  }

  @Query(() => [Activity])
  activities(@Ctx() { em }: MyContext): Promise<Activity[]> {
    return em.find(Activity, {});
  }

  @Mutation(() => Activity)
  async createActivity(
    @Ctx() { em }: MyContext,
    @Arg('title') title: string
  ): Promise<Activity> {
    const ad = em.create(Activity, { title });
    await em.save(ad);
    return ad;
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number,
    @Arg('title', { nullable: true }) title: string
  ): Promise<Activity> {
    const ad = await em.findOneOrFail(Activity, id);
    ad.title = title;
    await em.save(ad);
    return ad;
  }

  @Mutation(() => Boolean)
  async deleteActivity(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<boolean> {
    try {
      await em.delete(Activity, id);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllActivities(@Ctx() { em }: MyContext): Promise<boolean> {
    try {
      await em.clear(Activity);
      return true;
    } catch {
      return false;
    }
  }
}
