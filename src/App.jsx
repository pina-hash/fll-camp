import { useEffect, useMemo, useState } from 'react';
import { useTeamState } from './state/useTeamState.js';
import { getQuest } from './state/quests.js';
import { ATTRIBUTION } from './state/resources.js';
import Onboarding from './components/Onboarding.jsx';
import Climb from './components/Climb.jsx';
import QuestDetail from './components/QuestDetail.jsx';
import Troubleshooter from './components/Troubleshooter.jsx';
import MentorGate from './components/MentorGate.jsx';
import Menu from './components/Menu.jsx';
import MentorResources from './components/MentorResources.jsx';
import ResourceLibrary from './components/ResourceLibrary.jsx';
import DailyRhythm from './components/DailyRhythm.jsx';

const MENTOR_ROUTE = '#/mentor-resources';
const RESOURCES_ROUTE = '#/resources';

const TRACK_LABELS = { rookie: 'Rookie', veteran: 'Veteran' };
const TIER_LABELS = {
  none: 'Bronze',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export default function App() {
  const team = useTeamState();
  const {
    state,
    createTeam,
    renameTeam,
    switchTrack,
    toggleMentor,
    signOff,
    pendingSignoff,
  } = team;

  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGate, setShowGate] = useState(false);

  // Lightweight hash routing for the mentor-resources page.
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // The typed criterion actions handed to the quest detail gate.
  const questActions = useMemo(
    () => ({
      toggleCheck: team.toggleCheck,
      logRun: team.logRun,
      popRun: team.popRun,
      setAnswer: team.setAnswer,
      captureEvidence: team.captureEvidence,
      getEvidenceUrl: team.getEvidenceUrl,
    }),
    [team.toggleCheck, team.logRun, team.popRun, team.setAnswer, team.captureEvidence, team.getEvidenceUrl]
  );

  // Auto-prompt the mentor gate the moment a tier's final quest is completed.
  const pendingTier = pendingSignoff?.toTier ?? null;
  useEffect(() => {
    if (pendingTier) {
      setShowGate(true);
      setSelectedQuestId(null);
    }
  }, [pendingTier]);

  // First run: capture team name + track before anything else.
  if (!state.team) {
    return <Onboarding onCreate={createTeam} />;
  }

  // Mentor reference page (reachable from the menu).
  if (route === MENTOR_ROUTE) {
    return <MentorResources onBack={() => { window.location.hash = ''; }} />;
  }

  // Student Resource Library (free-browse; menu + on-ladder entry points). The
  // troubleshooter can be opened from here, so it rides along as an overlay.
  if (route === RESOURCES_ROUTE) {
    return (
      <>
        <ResourceLibrary
          onBack={() => { window.location.hash = ''; }}
          onOpenTroubleshooter={() => setShowTroubleshooter(true)}
        />
        {showTroubleshooter && (
          <Troubleshooter
            onClose={() => setShowTroubleshooter(false)}
            needsMentor={state.needsMentor}
            onRequestMentor={toggleMentor}
          />
        )}
      </>
    );
  }

  const ladderId = state.activeLadder;
  const { done, total } = team.progressCounts(ladderId);
  const currentId = team.currentQuestId(ladderId);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const selectedQuest = selectedQuestId ? getQuest(ladderId, selectedQuestId) : null;

  function handleRename(name) {
    renameTeam(name);
    setShowMenu(false);
  }
  function handleSwitchTrack(track) {
    switchTrack(track);
    setShowMenu(false);
  }
  function handleSignOff(code) {
    const ok = signOff(pendingSignoff.toTier, code);
    if (ok) setShowGate(false);
    return ok;
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__heading">
          <p className="app__kicker">DBTI FLL Summer Camp · Mission Hub</p>
          <h1 className="app__team">{state.team.name}</h1>
          <p className="app__track">
            {TRACK_LABELS[ladderId]} Track
            {ladderId === 'veteran' && (
              <> · <span className="app__tier">{TIER_LABELS[state.ladders.veteran.tier]} tier</span></>
            )}
          </p>
        </div>
        <button
          type="button"
          className="iconbtn"
          onClick={() => setShowMenu(true)}
          aria-label="Team menu"
        >
          ☰
        </button>
      </header>

      <div className="app__progress">
        <div className="progressbar" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
          <div className="progressbar__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="app__progress-label">
          {done} / {total} quests complete
        </p>
      </div>

      <main className="app__main">
        <button
          type="button"
          className="library-bar"
          onClick={() => { window.location.hash = RESOURCES_ROUTE; }}
        >
          <span className="library-bar__icon" aria-hidden="true">📚</span>
          <span className="library-bar__text">Browse the Resource Library</span>
          <span className="library-bar__go" aria-hidden="true">→</span>
        </button>

        {pendingSignoff && (
          <button
            type="button"
            className="signoff-banner"
            onClick={() => setShowGate(true)}
          >
            <span className="signoff-banner__title">
              {pendingSignoff.fromTier.charAt(0).toUpperCase() + pendingSignoff.fromTier.slice(1)} tier
              complete!
            </span>
            <span className="signoff-banner__cta">
              Tap for the mentor sign-off to unlock {TIER_LABELS[pendingSignoff.toTier]} →
            </span>
          </button>
        )}

        <Climb
          state={state}
          ladderId={ladderId}
          currentId={currentId}
          onOpen={setSelectedQuestId}
        />

        <DailyRhythm />

        <p className="app__footnote">Progress saves on this device automatically.</p>
        <p className="app__attribution">{ATTRIBUTION}</p>
      </main>

      <nav className="fab-bar" aria-label="Help">
        <button
          type="button"
          className="fab fab--stuck"
          onClick={() => setShowTroubleshooter(true)}
        >
          <span className="fab__icon" aria-hidden="true">🛠️</span> Stuck?
        </button>
        <button
          type="button"
          className={`fab ${state.needsMentor ? 'fab--requested' : 'fab--mentor'}`}
          onClick={toggleMentor}
          aria-pressed={state.needsMentor}
        >
          <span className="fab__icon" aria-hidden="true">{state.needsMentor ? '✓' : '✋'}</span>
          {state.needsMentor ? 'Mentor requested' : 'Request a Mentor'}
        </button>
      </nav>

      {selectedQuest && (
        <QuestDetail
          quest={selectedQuest}
          ladderId={ladderId}
          status={team.questStatus(ladderId, selectedQuestId)}
          criteria={team.criteriaFor(ladderId, selectedQuestId)}
          actions={questActions}
          deviceCanCapture={state.deviceCanCapture}
          onClose={() => setSelectedQuestId(null)}
        />
      )}

      {showTroubleshooter && (
        <Troubleshooter
          onClose={() => setShowTroubleshooter(false)}
          needsMentor={state.needsMentor}
          onRequestMentor={toggleMentor}
        />
      )}

      {showMenu && (
        <Menu
          team={state.team}
          activeLadder={ladderId}
          onRename={handleRename}
          onSwitchTrack={handleSwitchTrack}
          deviceCanCapture={state.deviceCanCapture}
          onSetDeviceCanCapture={team.setDeviceCanCapture}
          onOpenResourceLibrary={() => {
            window.location.hash = RESOURCES_ROUTE;
            setShowMenu(false);
          }}
          onOpenMentorResources={() => {
            window.location.hash = MENTOR_ROUTE;
            setShowMenu(false);
          }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {showGate && pendingSignoff && (
        <MentorGate
          toTier={pendingSignoff.toTier}
          onSubmit={handleSignOff}
          onClose={() => setShowGate(false)}
        />
      )}
    </div>
  );
}
