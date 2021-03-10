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
    // transformer: {
    //   to: (val) => val,
    //   from(val): String | null {
    //     if (val) {
    //       return `(${val.x}, ${val.y})`;
    //     } else return null;
    //   }
    // },
  })
  organizerCoordinatesDb: Geometry;

  @Column({
    type: 'geography',
    srid: 4326
    // transformer: {
    //   to: (val) => val,
    //   from(val): String | null {
    //     if (val) {
    //       return `(${val.x}, ${val.y})`;
    //     } else return null;
    //   }
    // },
    // nullable: true
  })
  eventCoordinatesDb: Geometry;

  @Field(() => Location)
  discoveryCoordinates(): Location {
    // const loc = this.eventCoordinatesDb
    //   ? this.eventCoordinatesDb
    //   : this.organizerCoordinatesDb;
    // const parsed = loc.toString().slice(1, loc.toString().length - 1);
    // const coordinates = parsed.split(',');
    // const x = +coordinates[0];
    // const y = +coordinates[1];
    // return new Location(x, y);
    const loc = this.eventCoordinatesDb
      ? this.eventCoordinatesDb
      : this.organizerCoordinatesDb;
    // console.log('LOC');
    // console.log(loc);
    // console.log(this.id);
    const x = +(loc as Point).coordinates[0];
    const y = +(loc as Point).coordinates[1];
    return new Location(x, y);
  }

  @Field(() => Location, { nullable: true })
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
