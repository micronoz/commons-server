import { Ctx, Query, Resolver } from 'type-graphql';
import { Adventure } from '../entities/Adventure';
import { MyContext } from '../types';

@Resolver()
export class AdventureResolver {
  @Query(() => [Adventure])
  adventures(@Ctx() { em }: MyContext): Promise<Adventure[]> {
    return em.find(Adventure, {});
  }
}
