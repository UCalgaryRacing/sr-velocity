// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useCallback, useState } from "react";
import { CommentModal } from "../modals/commentModal";
import { CommentCard } from "./commentCard";
import { Comment, CommentType } from "state";
import { TextButton } from "components/interface";
import "./_styling/commentView.css";

type CommentViewProps = {
  contextId: string;
  comments: Comment[];
  type: CommentType;
  onUpdate: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
};

export const CommentView: React.FC<CommentViewProps> = (
  props: CommentViewProps
) => {
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);

  const generateComments = useCallback(() => {
    let commentUI: any = [];
    for (const comment of props.comments)
      commentUI.push(
        <CommentCard
          comment={comment}
          contextId={props.contextId}
          type={props.type}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
        />
      );
    if (commentUI.length > 0) return commentUI;
    else return <div className="no-comments">No comments yet!</div>;
  }, [props.comments]);

  return (
    <div className="comment-view">
      <div className="comment-content">
        {generateComments()}
        <TextButton title="Comment" onClick={() => setShowCommentModal(true)} />
      </div>
      {showCommentModal && (
        <CommentModal
          show={showCommentModal}
          toggle={(comment: Comment) => {
            if (comment) props.onUpdate(comment);
            setShowCommentModal(false);
          }}
          contextId={props.contextId}
          type={props.type}
        />
      )}
    </div>
  );
};
