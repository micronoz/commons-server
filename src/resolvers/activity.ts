import { LocationInput } from './../input-types/LocationInput';
import { Point } from 'geojson';
import { Arg, Mutation, Query, Resolver, Ctx } from 'type-graphql';
import { Activity } from '../entity/Activity';
import { UserActivity } from '../entity/UserActivity';
import { MyContext } from '../types';

@Resolver()
export class ActivityResolver {
  @Query(() => Activity, { nullable: true })
  activity(@Arg('id') id: string): Promise<Activity> {
    return Activity.findOneOrFail({ id });
  }

  //TODO: Add location and category filter
  //TODO: Do not give all these at once
  @Query(() => [Activity])
  async discoverActivities(): Promise<Activity[]> {
    return Activity.find();
  }

  @Mutation(() => Activity)
  async createActivity(
    @Ctx() { user }: MyContext,
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('mediumType') mediumType: string,
    @Arg('organizerCoordinates', () => LocationInput, { nullable: true })
    organizerCoordinates: LocationInput,
    @Arg('eventCoordinates', () => LocationInput, { nullable: true })
    eventCoordinates: LocationInput,
    @Arg('physicalAddress', { nullable: true }) physicalAddress: string,
    @Arg('eventUrl', { nullable: true }) eventUrl: string,
    @Arg('eventDateTime', { nullable: true }) eventDateTime: Date
  ): Promise<Activity> {
    var activity = Activity.create({
      title,
      description,
      mediumType,
      physicalAddress,
      eventUrl,
      eventDateTime
    });
    if (organizerCoordinates) {
      const organizerPoint = `(${organizerCoordinates.xLocation}, ${organizerCoordinates.yLocation})`;
      activity.organizerCoordinatesDb = (organizerPoint as unknown) as Point;
    }
    if (eventCoordinates) {
      const eventPoint = `(${eventCoordinates.xLocation}, ${eventCoordinates.yLocation})`;
      activity.eventCoordinatesDb = (eventPoint as unknown) as Point;
    }
    activity = await activity.save();
    const userActivity = UserActivity.create({
      isOrganizing: true,
      attendanceStatus: 0
    });
    userActivity.activity = Promise.resolve(activity);
    userActivity.user = Promise.resolve(user);
    await userActivity.save();
    return activity;
  }

  // @Mutation(() => Activity)
  // async setEventCoordinates(
  //   @Ctx() { user }: MyContext,
  //   @Arg('id') id: string,
  //   @Arg('location', () => LocationInput) location: LocationInput
  // ): Promise<Activity> {
  //   const activity = await Activity.findOneOrFail({ id });
  //   const organizerId = (await activity.organizer()).id;
  //   if (organizerId !== user.id) {
  //     throw new ApolloError(
  //       'Cannot set location of event because the user is not the organizer'
  //     );
  //   }
  //   const point = `(${location.xLocation}, ${location.yLocation})`;
  //   activity.eventCoordinatesDb = (point as unknown) as Point;
  //   await activity.save();
  //   return activity;
  // }

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

  //TODO: Delete
  @Mutation(() => Boolean)
  async deleteAllActivities(): Promise<boolean> {
    try {
      const activities = await Activity.find();
      Activity.remove(activities);
      return true;
    } catch {
      return false;
    }
  }
}
