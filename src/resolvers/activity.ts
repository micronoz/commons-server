import { OnlineActivity } from './../entity/OnlineActivity';
import { InPersonActivity } from './../entity/InPersonActivity';
import {
  ApolloError,
  UserInputError,
  AuthenticationError
} from 'apollo-server-express';
import { LocationInput } from './../input-types/LocationInput';
import { Point } from 'geojson';
import { Arg, Mutation, Query, Resolver, Ctx } from 'type-graphql';
import { Activity } from '../entity/Activity';
import { UserActivity } from '../entity/UserActivity';
import { MyContext } from '../types';
import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { User } from '../entity/User';
const client = new Client({});

@Resolver()
export class ActivityResolver {
  @Query(() => Activity, { nullable: true })
  activity(@Arg('id') id: string): Promise<Activity> {
    return Activity.findOneOrFail({ id });
  }

  @Query(() => [InPersonActivity])
  async discoverInPersonActivities(
    @Arg('discoveryCoordinates') discoveryCoordinates: LocationInput,
    @Arg('radiusInKilometers') radiusInKilometers: number
  ): Promise<InPersonActivity[]> {
    //TODO: Filter by coordinates and radius.
    return InPersonActivity.find();
  }
  @Query(() => [OnlineActivity])
  async discoverOnlineActivities(): Promise<OnlineActivity[]> {
    return OnlineActivity.find();
  }

  async getCoordinatesFromPhysicalAddress(
    physicalAddress: string
  ): Promise<LatLngLiteral> {
    try {
      const r = await client.geocode({
        params: {
          key: process.env.GOOGLE_MAPS_API_KEY || '',
          address: physicalAddress
        },
        timeout: 1000
      });
      console.log('Geolocator output:');
      if (r && r.data?.results.length > 0) {
        console.log(r.data.results[0].geometry.location);
        return r.data.results[0].geometry.location;
      } else {
        console.log(
          `Could not find coordinates for address ${physicalAddress}`
        );
        throw new UserInputError(`Invalid physical address`);
      }
    } catch (e) {
      if (e instanceof UserInputError) {
        throw e;
      }
      console.log('Geolocator ERROR:');
      console.log(e);
      throw new ApolloError('Geolocator error.');
    }
  }
  @Mutation(() => InPersonActivity)
  async createInPersonActivity(
    @Ctx() { getUser }: MyContext,
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
    //TODO: Make non nullable (organizerCoordinates)
    @Arg('organizerCoordinates', () => LocationInput, { nullable: true })
    organizerCoordinates: LocationInput,
    @Arg('physicalAddress', { nullable: true }) physicalAddress: string,
    @Arg('eventDateTime', { nullable: true }) eventDateTime: Date
  ): Promise<InPersonActivity> {
    const user = await getUser;
    var activity = InPersonActivity.create({
      title,
      description,
      mediumType: 'in_person',
      physicalAddress,
      eventDateTime
    });

    if (organizerCoordinates) {
      const organizerPoint = `(${organizerCoordinates.xLocation}, ${organizerCoordinates.yLocation})`;
      activity.organizerCoordinatesDb = (organizerPoint as unknown) as Point;
    }
    if (physicalAddress) {
      const eventCoordinates = await this.getCoordinatesFromPhysicalAddress(
        physicalAddress
      );
      const eventPoint = `(${eventCoordinates.lng}, ${eventCoordinates.lat})`;
      activity.eventCoordinatesDb = (eventPoint as unknown) as Point;
    }

    activity = await activity.save();
    const userActivity = UserActivity.create({
      isOrganizing: true,
      attendanceStatus: 1
    });
    userActivity.activity = Promise.resolve(activity);
    userActivity.user = Promise.resolve(user);
    await userActivity.save();
    return activity;
  }
  @Mutation(() => OnlineActivity)
  async createOnlineActivity(
    @Ctx() { getUser }: MyContext,
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('eventUrl', { nullable: true }) eventUrl: string,
    @Arg('eventDateTime', { nullable: true }) eventDateTime: Date
  ): Promise<OnlineActivity> {
    const user = await getUser;
    var activity = OnlineActivity.create({
      title,
      description,
      mediumType: 'online',
      eventUrl,
      eventDateTime
    });
    activity = await activity.save();
    const userActivity = UserActivity.create({
      isOrganizing: true,
      attendanceStatus: 1
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

  @Mutation(() => UserActivity)
  async requestToJoinActivity(
    @Arg('id') id: string,
    @Ctx() { getUser }: MyContext
  ): Promise<UserActivity> {
    const user = await getUser;
    const activity = await Activity.findOneOrFail({ id });
    if (
      await UserActivity.findOne({
        where: {
          activity: activity,
          user: user
        }
      })
    ) {
      throw new ApolloError(
        `User has already requested to join this activity with id: ${id}`,
        '400'
      );
    }
    let userActivity = UserActivity.create();
    userActivity.isOrganizing = false;
    userActivity.attendanceStatus = 0;
    userActivity.activity = Promise.resolve(activity);
    userActivity.user = Promise.resolve(user);
    userActivity = await userActivity.save();
    return userActivity;
  }

  @Mutation(() => UserActivity)
  async acceptJoinRequest(
    @Arg('userId') userId: string,
    @Arg('activityId') activityId: string,
    @Ctx() { getUser }: MyContext
  ): Promise<UserActivity> {
    const user = await getUser;
    return this.setUserActivityAttendanceCheckAdmin(
      activityId,
      user,
      userId,
      1
    );
  }

  @Mutation(() => UserActivity)
  async rejectJoinRequest(
    @Arg('userId') userId: string,
    @Arg('activityId') activityId: string,
    @Ctx() { getUser }: MyContext
  ): Promise<UserActivity> {
    const user = await getUser;
    return this.setUserActivityAttendanceCheckAdmin(
      activityId,
      user,
      userId,
      2
    );
  }

  async setUserActivityAttendanceCheckAdmin(
    activityId: string,
    user: User,
    userId: string,
    attendanceStatus: number
  ): Promise<UserActivity> {
    if (!user) {
      throw new AuthenticationError('User has not been created.');
    }
    const activity = await Activity.findOneOrFail({ id: activityId });
    const adminUserActivity = await UserActivity.findOne({
      where: {
        activity: activity,
        user: user
      }
    });
    if (adminUserActivity == null || !adminUserActivity.isOrganizing) {
      throw new ApolloError(
        `User is not authorized to make changes to this activity with id: ${activityId}`,
        '400'
      );
    }
    const otherUserActivity = await UserActivity.findOneOrFail({
      where: { user: await User.findOneOrFail({ id: userId }), activity }
    });
    otherUserActivity.attendanceStatus = attendanceStatus;
    return otherUserActivity.save();
  }
}
