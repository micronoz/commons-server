import { Location } from './../model/Location';
import { Geometry, Point } from 'geojson';
import { Field, ObjectType } from 'type-graphql';
import { ChildEntity, Column } from 'typeorm';
import { Activity } from './Activity';

@ObjectType({ implements: Activity })
@ChildEntity()
export class InPersonActivity extends Activity {
  @Column({
    type: 'geography',
    srid: 4326
  })
  organizerCoordinatesDb: Geometry;

  @Column({
    type: 'geography',
    srid: 4326,
    nullable: true
  })
  eventCoordinatesDb: Geometry | null;

  @Field(() => Location)
  discoveryCoordinates(): Location {
    const loc = this.eventCoordinatesDb
      ? this.eventCoordinatesDb
      : this.organizerCoordinatesDb;

    const x = +(loc as Point).coordinates[0] + Math.random();
    const y = +(loc as Point).coordinates[1] + Math.random();
    return new Location(x, y);
  }

  eventCoordinates(): Location | null {
    if (this.eventCoordinatesDb == null) {
      return null;
    }
    const loc = this.eventCoordinatesDb;
    const x = +(loc as Point).coordinates[0];
    const y = +(loc as Point).coordinates[1];
    return new Location(x, y);
  }

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  physicalAddress: string;
}
