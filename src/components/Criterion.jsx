import { useState } from 'react';
import { isCriterionSatisfied } from '../state/state.js';
import Evidence from './Evidence.jsx';

// One self-check criterion, rendered by its type. All four types report
// completion the same way (isCriterionSatisfied) so the gate stays consistent.
export default function Criterion({ ladderId, questId, idx, def, st, actions, deviceCanCapture }) {
  const satisfied = isCriterionSatisfied(def, st, deviceCanCapture);

  switch (def.type) {
    case 'check':
      return (
        <CheckCriterion
          def={def}
          satisfied={satisfied}
          onToggle={() => actions.toggleCheck(ladderId, questId, idx)}
        />
      );
    case 'runlog':
      return (
        <RunlogCriterion
          def={def}
          st={st}
          satisfied={satisfied}
          onHit={() => actions.logRun(ladderId, questId, idx, 'hit')}
          onMiss={() => actions.logRun(ladderId, questId, idx, 'miss')}
          onUndo={() => actions.popRun(ladderId, questId, idx)}
        />
      );
    case 'answer':
      return (
        <AnswerCriterion
          def={def}
          st={st}
          satisfied={satisfied}
          onAnswer={(text) => actions.setAnswer(ladderId, questId, idx, text)}
        />
      );
    case 'evidence':
      return (
        <Evidence
          ladderId={ladderId}
          questId={questId}
          idx={idx}
          def={def}
          st={st}
          captureEvidence={actions.captureEvidence}
          getEvidenceUrl={actions.getEvidenceUrl}
          deviceCanCapture={deviceCanCapture}
        />
      );
    default:
      return null;
  }
}

function CheckCriterion({ def, satisfied, onToggle }) {
  return (
    <button
      type="button"
      className={`criterion ${satisfied ? 'criterion--checked' : ''}`}
      onClick={onToggle}
      aria-pressed={satisfied}
    >
      <span className="criterion__box" aria-hidden="true">
        {satisfied ? '✓' : ''}
      </span>
      <span className="criterion__label">{def.label}</span>
    </button>
  );
}

function RunlogCriterion({ def, st, satisfied, onHit, onMiss, onUndo }) {
  const runs = Array.isArray(st?.runs) ? st.runs : [];
  const hits = runs.filter((r) => r.result === 'hit').length;
  const full = runs.length >= def.n;

  return (
    <div className={`runlog ${satisfied ? 'runlog--done' : ''}`}>
      <div className="runlog__head">
        <span className="runlog__label">{def.label}</span>
        <span className="runlog__tally">
          {hits} / {def.pass} hits{satisfied ? ' ✓' : ''}
        </span>
      </div>

      <div className="runlog__pips" aria-hidden="true">
        {Array.from({ length: def.n }).map((_, i) => {
          const r = runs[i];
          const cls = r ? (r.result === 'hit' ? 'pip--hit' : 'pip--miss') : 'pip--empty';
          return (
            <span key={i} className={`pip ${cls}`}>
              {r ? (r.result === 'hit' ? '✓' : '✗') : i + 1}
            </span>
          );
        })}
      </div>

      <div className="runlog__actions">
        <button type="button" className="runbtn runbtn--hit" onClick={onHit} disabled={full}>
          Hit
        </button>
        <button type="button" className="runbtn runbtn--miss" onClick={onMiss} disabled={full}>
          Miss
        </button>
        <button
          type="button"
          className="runbtn runbtn--undo"
          onClick={onUndo}
          disabled={runs.length === 0}
        >
          Undo
        </button>
      </div>
      <p className="runlog__hint">
        {full
          ? `Logged ${runs.length} of ${def.n} runs.`
          : `Log up to ${def.n} runs · need ${def.pass} hits.`}
      </p>
    </div>
  );
}

function AnswerCriterion({ def, st, satisfied, onAnswer }) {
  // Local state keeps typing smooth; every change is pushed up (and persisted).
  const [text, setText] = useState(st?.text ?? '');
  const min = def.min ?? 8;
  const len = text.trim().length;

  return (
    <div className={`answer ${satisfied ? 'answer--done' : ''}`}>
      <label className="answer__label">
        {def.label}
        {satisfied && <span className="answer__ok" aria-hidden="true"> ✓</span>}
      </label>
      <textarea
        className="answer__input"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onAnswer(e.target.value);
        }}
        rows={2}
        placeholder="Type your answer…"
      />
      {!satisfied && (
        <p className="answer__hint">
          {len}/{min} characters
        </p>
      )}
    </div>
  );
}
