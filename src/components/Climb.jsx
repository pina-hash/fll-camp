import QuestCard from './QuestCard.jsx';
import {
  ROOKIE_ARCS,
  ROOKIE_OPTIONAL,
  VETERAN_TIERS,
  getQuest,
} from '../state/quests.js';
import { questStatus, isTierUnlocked, veteranTier } from '../state/state.js';

// The vertical climb. Rookie = three week-arcs with fill-green dots. Veteran =
// Bronze → Silver → Gold → Platinum medal climb, locked tiers dimmed until
// a mentor sign-off.
export default function Climb({ state, ladderId, currentId, onOpen }) {
  return ladderId === 'veteran' ? (
    <VeteranClimb state={state} currentId={currentId} onOpen={onOpen} />
  ) : (
    <RookieClimb state={state} currentId={currentId} onOpen={onOpen} />
  );
}

function RookieClimb({ state, currentId, onOpen }) {
  return (
    <div className="climb">
      {ROOKIE_ARCS.map((arc) => (
        <section className="climb-group" key={arc.id}>
          <h3 className="climb-group__head">{arc.label}</h3>
          <div className="climb-group__track">
            {arc.questIds.map((qid) => {
              const quest = getQuest('rookie', qid);
              return (
                <QuestCard
                  key={qid}
                  quest={quest}
                  status={questStatus(state, 'rookie', qid)}
                  isCurrent={qid === currentId}
                  onOpen={onOpen}
                />
              );
            })}
          </div>
        </section>
      ))}

      <section className="climb-group climb-group--optional">
        <h3 className="climb-group__head">
          Optional Side-Quest <span className="climb-group__tag">does not block progress</span>
        </h3>
        <div className="climb-group__track">
          {ROOKIE_OPTIONAL.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              status={questStatus(state, 'rookie', quest.id)}
              isCurrent={false}
              onOpen={onOpen}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function VeteranClimb({ state, currentId, onOpen }) {
  const reached = veteranTier(state);

  return (
    <div className="climb">
      {VETERAN_TIERS.map((tier) => {
        const unlocked = isTierUnlocked(state, tier.id);
        const isReachedTier = reached === tier.id || (reached === 'none' && tier.id === 'bronze');
        return (
          <section
            className={`climb-group tier ${unlocked ? '' : 'tier--locked'} ${
              isReachedTier ? 'tier--active' : ''
            }`}
            key={tier.id}
            style={{ '--tier-color': `var(${tier.colorVar})` }}
          >
            <h3 className="tier__head">
              <span className="tier__medal" aria-hidden="true" />
              <span className="tier__name">{tier.label}</span>
              <span className="tier__sub">{tier.sub}</span>
              {!unlocked && <span className="tier__lock" aria-label="Locked">🔒</span>}
            </h3>
            <div className="climb-group__track">
              {tier.questIds.map((qid) => {
                const quest = getQuest('veteran', qid);
                return (
                  <QuestCard
                    key={qid}
                    quest={quest}
                    status={questStatus(state, 'veteran', qid)}
                    isCurrent={qid === currentId}
                    onOpen={onOpen}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
