// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Comment, useAppSelector, RootState } from "state";
import ReactHtmlParser from "react-html-parser";
import "./_styling/commentCard.css";

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = (
  props: CommentCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);

  const editComment = () => {
    // TODO
  };

  const deleteComment = () => {
    // TODO
  };

  return (
    <div className="comment-card">
      <div className="comment-user">{props.comment.username}</div>
      <div className="comment-content">
        {ReactHtmlParser(props.comment.content)}
      </div>
      <div className="comment-time">{convertUnixTime(props.comment.time)}</div>
      {user?._id !== props.comment.userId && (
        <div className="modify-comment">
          <div id="comment-edit" onClick={editComment}>
            Edit
          </div>
          <div id="comment-delete" onClick={deleteComment}>
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

const convertUnixTime = (unixTimestamp: number) => {
  var date = new Date(unixTimestamp * 1000);
  return date.toLocaleString();
};
