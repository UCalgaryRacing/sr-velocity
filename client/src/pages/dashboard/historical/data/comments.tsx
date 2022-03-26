// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import { formatDistanceToNow } from "date-fns";
import { RunType } from "./run";
import { SessionType } from "./session";
import { useFetch } from "../../../../hooks/useFetch";

interface Comment {
  id: number;
  userId: number;
  date: Date;
  content: string;
}

interface SessionComment extends Comment {
  sessionId: number;
}

interface RunComment extends Comment {
  runId: number;
}

type Props = {
  item: RunType | SessionType;
  itemType: "run" | "session";
};

export default function Comments({ item, itemType }: Props) {
  // TODO: Replace with getRunComments and getSessionComments
  // Temporary URL, using json-server for dummy data
  const url = `http://localhost:3001/${itemType}Comments?${itemType}Id=${item.id}`;
  const { data, error } =
    itemType === "run" ? useFetch<RunComment[]>(url) : useFetch<SessionComment[]>(url);

  // Data should be sorted by date
  // return <div className="data-comments"></div>;
  // }

  return error ? (
    <p>Error fetching data {error.message}</p>
  ) : !data ? (
    <p>Loading...</p>
  ) : data.length === 0 ? (
    <p>No comments</p>
  ) : (
    <ul>
      {data.map((comment) => (
        <li key={comment.id}>
          <p>{comment.userId}</p>
          <p>{comment.content}</p>
          <p className="data-comments-date">{comment.date}</p>
          {/* <p>{formatDistanceToNow(comment.date, { addSuffix: true })}</p> */}
        </li>
      ))}
    </ul>
  );
}
