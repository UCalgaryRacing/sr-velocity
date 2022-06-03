// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { ConfirmModal } from "components/modals";
import { CommentModal } from "../modals/commentModal";
import { Alert } from "components/interface";
import { Comment, useAppSelector, RootState, CommentType } from "state";
import ReactHtmlParser from "react-html-parser";
import { deleteComment } from "crud";
import "./_styling/commentCard.css";

interface CommentCardProps {
  comment: Comment;
  contextId: string;
  type: CommentType;
  onUpdate: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
}

export const CommentCard: React.FC<CommentCardProps> = (
  props: CommentCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

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

  return (
    <div className="comment-card">
      <div className="comment-user">{props.comment.username}</div>
      <div className="comment-content">
        {ReactHtmlParser(props.comment.content)}
      </div>
      <div className="comment-time">
        {convertUnixTime(props.comment.lastUpdate)}
      </div>
      <div className="modify-comment">
        <div id="comment-reply" onClick={() => setShowModal(true)}>
          Reply
        </div>
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
          }}
          comment={props.comment}
          contextId={props.contextId}
          type={props.type}
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
