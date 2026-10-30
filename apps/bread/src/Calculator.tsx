import { BakeCard, DoughCard, FlourCard, KitchenCard, StarterCard, WhenCard } from './Cards';
import type { Ctx } from './ctx';
import { Assumptions, RecipeCard, RiseCheck, StepsCard, type RecipeActions } from './Recipe';

export function Calculator({ c, a }: { c: Ctx; a: RecipeActions }) {
  const ready = !!c.plan.chosen?.estimate;
  return (
    <div className="stack">
      <FlourCard c={c} />
      <StarterCard c={c} />
      <DoughCard c={c} />
      <KitchenCard c={c} />
      <BakeCard c={c} />
      <WhenCard c={c} />

      <p className="hint center" style={{ margin: 0 }}>
        The result updates as you change anything.
      </p>

      {ready ? (
        <>
          <RecipeCard c={c} a={a} />
          <StepsCard c={c} a={a} />
          <RiseCheck />
          <Assumptions />
        </>
      ) : (
        <p className="error" role="status">
          Enter the weight of your flour, and the water, starter and salt percentages.
        </p>
      )}
    </div>
  );
}
