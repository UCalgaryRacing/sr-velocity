// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { ConfirmModal, CommentModal } from "components/modals";
import { Alert } from "components/interface";
import { Comment, useAppSelector, RootState, CommentType } from "state";
import ReactHtmlParser from "react-html-parser";
import { deleteComment } from "crud";
import "./commentCard.css";

interface CommentCardProps {
  comment: Comment;
  contextId: string;
  type: CommentType;
  onUpdate: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  depth: number;
}

export const CommentCard: React.FC<CommentCardProps> = (
  props: CommentCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [reply, setReply] = useState<boolean>(false);

  const onDelete = () => {
    setLoading(true);
    deleteComment(props.comment._id)
      .then(() => {
        setLoading(false);
        props.onDelete(props.comment._id);
      })
      .catch((_: any) => {
        setLoading(false);
        setShowAlert(true);
      });
  };

  const generateReplies = () => {
    let replies = [];
    for (const reply of props.comment.comments) {
      replies.push(
        <CommentCard
          key={reply._id}
          comment={reply}
          contextId={props.contextId}
          type={props.type}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
          depth={props.depth + 1}
        />
      );
    }
    return replies;
  };

  return (
    <div className="comment-card">
      <div className="comment-user">
        {props.comment.username}
        <div className="comment-time">
          {convertUnixTime(props.comment.time)}
        </div>
      </div>
      <div className="comment-content">
        {ReactHtmlParser(props.comment.content)}
      </div>
      <div className="modify-comment">
        {props.depth < 4 && (
          <div
            id="comment-reply"
            onClick={() => {
              setReply(true);
              setShowModal(true);
            }}
          >
            Reply
          </div>
        )}
        {user?._id === props.comment.userId && (
          <>
            <div id="comment-edit" onClick={() => setShowModal(true)}>
              Edit
            </div>
            <div id="comment-delete" onClick={() => setShowConfirm(true)}>
              Delete
            </div>
          </>
        )}
      </div>
      {generateReplies()}
      <ConfirmModal
        title="Are you sure you want to delete this Comment?"
        show={showConfirm}
        toggle={() => setShowConfirm(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      {showModal && (
        <CommentModal
          show={showModal}
          toggle={(comment: Comment) => {
            if (comment) props.onUpdate(comment);
            setShowModal(false);
            setReply(false);
          }}
          comment={props.comment}
          contextId={props.contextId}
          type={props.type}
          reply={reply}
        />
      )}
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </div>
  );
};

const convertUnixTime = (unixTimestamp: number) => {
  var date = new Date(unixTimestamp);
  return date.toLocaleString();
};
