import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Adventure } from '../entities/Adventure';
import { MyContext } from '../types';

@Resolver()
export class AdventureResolver {
  @Query(() => Adventure, { nullable: true })
  adventure(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Adventure | null> {
    return em.findOne(Adventure, { id });
  }

  @Query(() => [Adventure])
  adventures(@Ctx() { em }: MyContext): Promise<Adventure[]> {
    return em.find(Adventure, {});
  }

  @Mutation(() => Adventure)
  async createAdventure(
    @Ctx() { em }: MyContext,
    @Arg('title') title: string
  ): Promise<Adventure> {
    const ad = em.create(Adventure, { title });
    await em.persistAndFlush(ad);
    return ad;
  }

  @Mutation(() => Adventure)
  async updateAdventure(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number,
    @Arg('title', { nullable: true }) title: string
  ): Promise<Adventure> {
    const ad = await em.findOneOrFail(Adventure, { id });
    ad.title = title;
    await em.persistAndFlush(ad);
    return ad;
  }

  @Mutation(() => Boolean)
  async deleteAdventure(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Adventure, { id });
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
