export interface RunType {
  id: number;
  collectionId: number;
  thingId: number;
  startDate: Date;
  endDate: Date;
}

type Props = {
  run: RunType
}

export default function Run({run}: Props) {
  return (
    <div className="run">
      {run.id}
    </div>
  );
}