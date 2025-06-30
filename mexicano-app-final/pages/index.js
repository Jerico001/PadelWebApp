
import { useState } from 'react';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(1);
  const [leaderboard, setLeaderboard] = useState({});

  const addPlayer = () => {
    if (name.trim()) {
      const id = crypto.randomUUID();
      const newPlayer = { id, name, points: 0, w: 0, d: 0, l: 0, played: 0 };
      setPlayers([...players, newPlayer]);
      setLeaderboard({ ...leaderboard, [id]: newPlayer });
      setName('');
    }
  };

  const generateMatch = () => {
    const sorted = Object.values(leaderboard).sort((a, b) => b.points - a.points);
    const selected = sorted.slice(0, 4);
    const team1 = [selected[0], selected[3]];
    const team2 = [selected[1], selected[2]];
    setMatches([{ team1, team2, score1: '', score2: '' }]);
  };

  const submitScore = () => {
    const updated = { ...leaderboard };
    matches.forEach(match => {
      const s1 = parseInt(match.score1);
      const s2 = parseInt(match.score2);
      if (!isNaN(s1) && !isNaN(s2)) {
        match.team1.forEach(p => {
          updated[p.id].points += s1;
          updated[p.id].played++;
        });
        match.team2.forEach(p => {
          updated[p.id].points += s2;
          updated[p.id].played++;
        });

        if (s1 > s2) {
          match.team1.forEach(p => updated[p.id].w++);
          match.team2.forEach(p => updated[p.id].l++);
        } else if (s2 > s1) {
          match.team2.forEach(p => updated[p.id].w++);
          match.team1.forEach(p => updated[p.id].l++);
        } else {
          [...match.team1, ...match.team2].forEach(p => updated[p.id].d++);
        }
      }
    });
    setLeaderboard(updated);
    setMatches([]);
    setRound(r => r + 1);
  };

  return (
    <div>
      <h1>Mexicano Padel Simulator</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Player name" />
      <button onClick={addPlayer}>Add Player</button>
      <h2>Players:</h2>
      <ul>{players.map(p => <li key={p.id}>{p.name}</li>)}</ul>
      <h2>Round {round}</h2>
      <button onClick={generateMatch}>Generate Match</button>
      {matches.map((m, i) => (
        <div key={i}>
          <div>Team 1: {m.team1.map(p => p.name).join(' & ')}</div>
          <div>Team 2: {m.team2.map(p => p.name).join(' & ')}</div>
          <input placeholder="Score 1" value={m.score1} onChange={e => {
            const newM = [...matches];
            newM[i].score1 = e.target.value;
            setMatches(newM);
          }} />
          <input placeholder="Score 2" value={m.score2} onChange={e => {
            const newM = [...matches];
            newM[i].score2 = e.target.value;
            setMatches(newM);
          }} />
        </div>
      ))}
      {matches.length > 0 && <button onClick={submitScore}>Submit Scores</button>}
      <h2>Leaderboard</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Player</th><th>Points</th><th>W-D-L</th><th>Played</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(leaderboard).sort((a, b) => b.points - a.points).map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.points}</td>
              <td>{p.w}-{p.d}-{p.l}</td>
              <td>{p.played}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
