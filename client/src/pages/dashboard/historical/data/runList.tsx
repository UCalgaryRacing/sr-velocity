// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
import Run, { RunType } from "./run";

type Props = {
  runs: RunType[];
  handleDownload: (item: RunType) => void;
};


export default function RunList({ runs, handleDownload }: Props) {
  return (
    <div id="run-list" className="data-list">
      {runs.length === 0 ? (
        <p>No Runs Found</p>
      ) : (
        runs.map((run) => <Run key={run.id} run={run} handleDownload={handleDownload} />)
      )}
    </div>
  );
}
