// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord
export interface Run {
  id: number;
  name: string;
}

type Props = {
  runs: Run[];
};


export default function RunList({ runs }: Props) {
  return (
    <div id="run-list">
      {runs.length === 0 ? (
        <p>No Runs Found</p>
      ) : (
        runs.map((run) => <div key={run.id}>{run.id}</div>)
      )}
    </div>
  );
}
