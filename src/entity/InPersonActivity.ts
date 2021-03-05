import { Location } from './../model/Location';
import { Point } from 'geojson';
import { Field, ObjectType } from 'type-graphql';
import { ChildEntity, Column } from 'typeorm';
import { IActivity } from './IActivity';

@ObjectType({ implements: IActivity })
@ChildEntity()
export class InPersonActivity extends IActivity {
  @Column({
    type: 'point',
    transformer: {
      to: (val) => val,
      from(val): String | null {
        if (val) {
          return `(${val.x}, ${val.y})`;
        } else return null;
      }
    },
    nullable: true
  })
  organizerCoordinatesDb: Point;

  @Column({
    type: 'point',
    transformer: {
      to: (val) => val,
      from(val): String | null {
        if (val) {
          return `(${val.x}, ${val.y})`;
        } else return null;
      }
    },
    nullable: true
  })
  eventCoordinatesDb: Point;

  @Field(() => Location, { nullable: true })
  discoveryCoordinates(): Location | null {
    if (this.mediumType === 'online') return null;
    const loc = this.eventCoordinatesDb
      ? this.eventCoordinatesDb
      : this.organizerCoordinatesDb;
    const parsed = loc.toString().slice(1, loc.toString().length - 1);
    const coordinates = parsed.split(',');
    const x = +coordinates[0];
    const y = +coordinates[1];
    return new Location(x, y);
  }

  @Field(() => Location, { nullable: true })
  eventCoordinates(): Location | null {
    if (this.eventCoordinatesDb == null) {
      return null;
    }
    const loc = this.eventCoordinatesDb;
    const parsed = loc.toString().slice(1, loc.toString().length - 1);
    const coordinates = parsed.split(',');
    const x = +coordinates[0];
    const y = +coordinates[1];
    return new Location(x, y);
  }

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  physicalAddress: string;
}
