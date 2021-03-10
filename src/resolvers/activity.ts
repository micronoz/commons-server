import { InPersonActivityRecommendation } from './../entity/InPersonActivityRecommendation';
import { OnlineActivity } from './../entity/OnlineActivity';
import { InPersonActivity } from './../entity/InPersonActivity';
import {
  ApolloError,
  UserInputError,
  AuthenticationError
} from 'apollo-server-express';
import { LocationInput } from './../input-types/LocationInput';
import { Geometry } from 'geojson';
import { Arg, Mutation, Query, Resolver, Ctx } from 'type-graphql';
import { Activity } from '../entity/Activity';
import { UserActivity } from '../entity/UserActivity';
import { MyContext } from '../types';
import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { getConnection, LessThan, SelectQueryBuilder } from 'typeorm';
const client = new Client({});

@Resolver()
export class ActivityResolver {
  @Query(() => Activity, { nullable: true })
  activity(@Arg('id') id: string): Promise<Activity> {
    return Activity.findOneOrFail({ id });
  }

  @Query(() => [InPersonActivityRecommendation])
  async discoverInPersonActivities(
    @Arg('discoveryCoordinates') discoveryCoordinates: LocationInput,
    @Arg('radiusInKilometers') radiusInKilometers: number
  ): Promise<InPersonActivityRecommendation[]> {
    try {
      const discoveryPoint = {
        type: 'Point',
        srid: 4326,
        coordinates: [
          discoveryCoordinates.xLocation,
          discoveryCoordinates.yLocation
        ]
      };

      const query = getConnection()
        .getRepository(InPersonActivity)
        .createQueryBuilder('activity');
      //TODO: Check if the distance is actually accurate in kilometers.
      const selectedActivities = await query
        .where(
          'ST_Distance(COALESCE("eventCoordinatesDb", "organizerCoordinatesDb"), ST_GeomFromGeoJSON(:discoveryPoint)::geography) < :radiusInSRID'
        )
        .setParameters({
          discoveryPoint: JSON.stringify(discoveryPoint),
          radiusInSRID: radiusInKilometers * 1000
        })
        .getMany();

      const distances = await query

        .select(
          'ST_Distance(COALESCE("eventCoordinatesDb", "organizerCoordinatesDb"), ST_GeomFromGeoJSON(:discoveryPoint)::geography)/1000 AS distance'
        )
        .addSelect('id AS id')
        .setParameters({
          discoveryPoint: JSON.stringify(discoveryPoint),
          radiusInSRID: radiusInKilometers * 1000
        })
        .andWhereInIds(selectedActivities)
        .execute();

      return selectedActivities.map((currentValue, index) => {
        //TODO: See if this case is possible. If it is, handle it.
        if (currentValue.id != distances[index].id) {
          console.error(
            'ERROR: Distances did not return in the same order as selected activities'
          );
          throw Error(
            'Distances did not return in the same order as selected activities'
          );
        }
        const recommendation = new InPersonActivityRecommendation();
        recommendation.activity = currentValue;
        recommendation.distance = distances[index].distance;
        return recommendation;
      });
    } catch (e) {
      console.error('Discover in person activity ERROR:');
      console.error(e);
      return Promise.reject('Error when discovering in person activity.');
    }
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
    @Ctx() { user }: MyContext,
    @Arg('title') title: string,
    @Arg('organizerCoordinates', () => LocationInput)
    organizerCoordinates: LocationInput,
    @Arg('description', { nullable: true })
    description: string,
    @Arg('physicalAddress', { nullable: true }) physicalAddress: string,
    @Arg('eventDateTime', { nullable: true }) eventDateTime: Date
  ): Promise<InPersonActivity> {
    if (!user) {
      throw new AuthenticationError('User has not been created.');
    }
    var activity = InPersonActivity.create({
      title,
      description,
      mediumType: 'in_person',
      physicalAddress,
      eventDateTime
    });
    // console.log(
    //   `Creating in person activity. Organizer coordinates: ${organizerCoordinates.xLocation}, ${organizerCoordinates.yLocation}`
    // );
    // const organizerPoint = `(${organizerCoordinates.xLocation}, ${organizerCoordinates.yLocation})`;
    const organizerPoint = {
      type: 'Point',
      coordinates: [
        organizerCoordinates.xLocation,
        organizerCoordinates.yLocation
      ]
    };
    activity.organizerCoordinatesDb = organizerPoint as Geometry;

    if (physicalAddress) {
      const eventCoordinates = await this.getCoordinatesFromPhysicalAddress(
        physicalAddress
      );
      const eventPoint = {
        type: 'Point',
        coordinates: [eventCoordinates.lng, eventCoordinates.lat]
      };
      activity.eventCoordinatesDb = eventPoint as Geometry;
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
  @Mutation(() => OnlineActivity)
  async createOnlineActivity(
    @Ctx() { user }: MyContext,
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('eventUrl', { nullable: true }) eventUrl: string,
    @Arg('eventDateTime', { nullable: true }) eventDateTime: Date
  ): Promise<OnlineActivity> {
    if (!user) {
      throw new AuthenticationError('User has not been created.');
    }
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

  @Mutation(() => UserActivity)
  async requestToJoinActivity(
    @Arg('id') id: string,
    @Ctx() { user }: MyContext
  ): Promise<UserActivity> {
    if (!user) {
      throw new AuthenticationError('User has not been created.');
    }
    const activity = await Activity.findOneOrFail({ id });
    const userActivity = UserActivity.create();
    userActivity.isOrganizing = false;
    userActivity.attendanceStatus = 0;
    userActivity.activity = Promise.resolve(activity);
    userActivity.user = Promise.resolve(user);
    (await activity.userConnections).push(userActivity);
    await activity.save();
    return userActivity;
  }
}
