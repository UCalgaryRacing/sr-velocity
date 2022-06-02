// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord

import React, { useCallback, useState } from "react";
import { CommentCard } from "./commentCard";
import { Comment } from "state";
import { TextArea } from "components/interface";
import "./_styling/commentView.css";

type CommentViewProps = {
  contextId: string;
  comments: Comment[];
};

export const CommentView: React.FC<CommentViewProps> = (
  props: CommentViewProps
) => {
  const [text, setText] = useState<string>();

  const generateComments = useCallback(() => {
    let commentUI: any = [];
    // TODO: Sort the comments
    //for (const comment of props.comments) {
    commentUI.push(
      <CommentCard
        comment={{
          _id: "",
          userId: "",
          username: "Tijunel",
          time: 100,
          content: "<div>This is a comment.<div>",
          sessionId: props.contextId,
        }}
      />
    );
    //}
    return commentUI;
  }, [props.comments]);

  return (
    <div className="comment-view">
      <div className="comment-content">
        {generateComments()}
        <TextArea
          value={text}
          onUpdate={setText}
          holder="Comment with velocity..."
        />
      </div>
    </div>
  );
};
