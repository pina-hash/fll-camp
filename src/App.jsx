import { useEffect, useState } from 'react';
import { useTeamState } from './state/useTeamState.js';
import { getItem, CATEGORIES } from './state/content.js';
import { todayKey } from './state/state.js';
import { SEASON } from './state/config.js';
import { ATTRIBUTION } from './state/resources.js';
import Onboarding from './components/Onboarding.jsx';
import Hub from './components/Hub.jsx';
import MissionDetail from './components/MissionDetail.jsx';
import Troubleshooter from './components/Troubleshooter.jsx';
import Menu from './components/Menu.jsx';
import MentorResources from './components/MentorResources.jsx';
import ResourceLibrary from './components/ResourceLibrary.jsx';
import TodayCheckin from './components/TodayCheckin.jsx';
import SiteTour from './components/SiteTour.jsx';
import BuildManual from './components/BuildManual.jsx';
import DailyRhythm from './components/DailyRhythm.jsx';

const MENTOR_ROUTE = '#/mentor-resources';
const RESOURCES_ROUTE = '#/resources';
const TODAY_ROUTE = '#/today';
const BUILD_ROUTE = '#/build';

/** Friendly local date for the session header, e.g. "Friday, August 7". */
function friendlyToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const BLANK_DAY = { roles: { coder: '', operator: '', protoBuilder: '', planner: '' }, reflection: '' };

const MISSION_ITEMS = CATEGORIES.find((c) => c.id === 'missions').items;

export default function App() {
  const team = useTeamState();
  const { state, createTeam, renameTeam, toggleMentor } = team;

  const [activeCategory, setActiveCategory] = useState('missions');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Lightweight hash routing for the standalone pages.
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Auto-launch the first-run tour once a team reaches the hub, only when it has
  // never been seen on this device. markTourSeen (on finish/skip) sets seenTour.
  useEffect(() => {
    if (state.team && !state.seenTour) setShowTour(true);
  }, [state.team, state.seenTour]);

  // On the Today route, make sure today's blank check-in entry exists.
  useEffect(() => {
    if (state.team && route === TODAY_ROUTE) team.ensureToday(todayKey());
  }, [route, state.team, team]);

  function closeTour() {
    setShowTour(false);
    if (!state.seenTour) team.markTourSeen();
  }

  // First run: capture team name + roster before anything else.
  if (!state.team) {
    return <Onboarding onCreate={createTeam} />;
  }

  // Mentor reference page (reachable from the menu).
  if (route === MENTOR_ROUTE) {
    return <MentorResources onBack={() => { window.location.hash = ''; }} />;
  }

  // The build manual, embedded. The season's current action item, so it also has
  // the loudest entry point on the hub (see the build bar below).
  if (route === BUILD_ROUTE) {
    return <BuildManual onBack={() => { window.location.hash = ''; }} />;
  }

  // Student Resource Library (free-browse; menu + on-hub entry points). The
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

  // Session check-in: roles + reflection for today (free-form, never gates).
  if (route === TODAY_ROUTE) {
    const day = todayKey();
    const entry = state.team.dailyLog?.[day] ?? BLANK_DAY;
    return (
      <TodayCheckin
        entry={entry}
        friendlyDate={friendlyToday()}
        onBack={() => { window.location.hash = ''; }}
        onSetRole={(roleKey, value) => team.setRole(day, roleKey, value)}
        onSetReflection={(text) => team.setReflection(day, text)}
      />
    );
  }

  // Season signal on the header: how much of the robot game has a written plan.
  const { done, total } = team.noteCounts(MISSION_ITEMS);
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Setup bar: only while today's roles are all blank and it hasn't been
  // dismissed for the day. Filling any role (or dismissing) collapses it.
  const today = todayKey();
  const todayEntry = state.team.dailyLog?.[today];
  const rolesAllBlank =
    !todayEntry || Object.values(todayEntry.roles).every((v) => !String(v ?? '').trim());
  const showSetupBar = rolesAllBlank && state.setupBarDismissedOn !== today;

  const selectedItem = selectedItemId ? getItem(selectedItemId) : null;
  const memberCount = state.team.members?.length ?? 0;

  function handleRename(name) {
    renameTeam(name);
    setShowMenu(false);
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__heading">
          <p className="app__kicker">DBTI FLL · {SEASON}</p>
          <h1 className="app__team">{state.team.name}</h1>
          <p className="app__track">
            Season Skill Hub
            {memberCount > 0 && (
              <> · {memberCount} {memberCount === 1 ? 'member' : 'members'}</>
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
        <div
          className="progressbar"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div className="progressbar__fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="app__progress-label">
          {done} / {total} robot game items have strategy notes
        </p>
      </div>

      <main className="app__main">
        {/* THE action item this season, so it is the first and loudest thing on
            the hub — above the session bar, above the tabs, not dismissible.
            Demote it to a normal bar once every team has built the bot. */}
        <button
          type="button"
          className="build-bar"
          onClick={() => { window.location.hash = BUILD_ROUTE; }}
        >
          <span className="build-bar__icon" aria-hidden="true">🧱</span>
          <span className="build-bar__body">
            <span className="build-bar__kicker">Start here</span>
            <span className="build-bar__title">Build the Competition Bot</span>
            <span className="build-bar__sub">
              All 225 steps — drivetrain, motors, hub, framing. Opens in the app.
            </span>
          </span>
          <span className="build-bar__go" aria-hidden="true">→</span>
        </button>

        {showSetupBar && (
          <div className="setup-bar">
            <button
              type="button"
              className="setup-bar__main"
              onClick={() => { window.location.hash = TODAY_ROUTE; }}
            >
              <span className="setup-bar__icon" aria-hidden="true">📋</span>
              <span className="setup-bar__text">Set up this session: assign your team's roles</span>
              <span className="setup-bar__go" aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="setup-bar__dismiss"
              onClick={() => team.dismissSetupBar(today)}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          className="library-bar"
          onClick={() => { window.location.hash = RESOURCES_ROUTE; }}
        >
          <span className="library-bar__icon" aria-hidden="true">📚</span>
          <span className="library-bar__text">Browse the Resource Library</span>
          <span className="library-bar__go" aria-hidden="true">→</span>
        </button>

        <Hub
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          hasNote={team.hasNote}
          onOpen={setSelectedItemId}
        />

        <DailyRhythm />

        <p className="app__footnote">Notes save on this device automatically.</p>
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

      {selectedItem && (
        <MissionDetail
          item={selectedItem}
          note={team.noteText(selectedItem.id)}
          onSetNote={(text) => team.setNote(selectedItem.id, text)}
          onClose={() => setSelectedItemId(null)}
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
          onRename={handleRename}
          onAddMember={team.addMember}
          onRemoveMember={team.removeMember}
          onOpenToday={() => {
            window.location.hash = TODAY_ROUTE;
            setShowMenu(false);
          }}
          onOpenResourceLibrary={() => {
            window.location.hash = RESOURCES_ROUTE;
            setShowMenu(false);
          }}
          onOpenMentorResources={() => {
            window.location.hash = MENTOR_ROUTE;
            setShowMenu(false);
          }}
          onOpenTour={() => {
            setShowTour(true);
            setShowMenu(false);
          }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {showTour && <SiteTour onClose={closeTour} />}
    </div>
  );
}
