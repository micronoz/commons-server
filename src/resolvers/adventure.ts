import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Adventure } from '../entity/Adventure';
import { MyContext } from '../types';

@Resolver()
export class AdventureResolver {
  @Query(() => Adventure, { nullable: true })
  adventure(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Adventure> {
    return em.findOneOrFail(Adventure, id);
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
    await em.save(ad);
    return ad;
  }

  @Mutation(() => Adventure)
  async updateAdventure(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number,
    @Arg('title', { nullable: true }) title: string
  ): Promise<Adventure> {
    const ad = await em.findOneOrFail(Adventure, id);
    ad.title = title;
    await em.save(ad);
    return ad;
  }

  @Mutation(() => Boolean)
  async deleteAdventure(
    @Ctx() { em }: MyContext,
    @Arg('id') id: number
  ): Promise<boolean> {
    try {
      await em.delete(Adventure, id);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllAdventures(@Ctx() { em }: MyContext): Promise<boolean> {
    try {
      await em.clear(Adventure);
      return true;
    } catch {
      return false;
    }
  }
}
