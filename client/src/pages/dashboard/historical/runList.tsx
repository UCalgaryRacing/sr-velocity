// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import Run, { RunType } from "./run";

type Props = {
  runs: RunType[];
};


export default function RunList({ runs }: Props) {
  return (
    <div id="run-list">
      {runs.length === 0 ? (
        <p>No Runs Found</p>
      ) : (
        runs.map((run) => <Run key={run.id} run={run} />)
      )}
    </div>
  );
}
