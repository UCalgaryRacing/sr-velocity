// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, Alert } from "components/interface";
import {
  CloseOutlined,
  Edit,
  CommentOutlined,
  CommentsDisabledOutlined,
} from "@mui/icons-material";
import { ThingModal } from "../modals/thingModal";
import { ConfirmModal } from "components/modals";
import { CommentView } from "components/cards";
import { deleteThing, getComments } from "crud";
import {
  useAppSelector,
  RootState,
  UserRole,
  isAuthAtLeast,
  Thing,
  Operator,
  Comment,
  CommentType,
} from "state";

interface ThingCardProps {
  thing: Thing;
  operators: Operator[];
  onThingUpdate?: (thing: Thing) => void;
  onThingDelete?: (thingId: string) => void;
}

export const ThingCard: React.FC<ThingCardProps> = (props: ThingCardProps) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [showThingModal, setShowThingModal] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const onDelete = () => {
    setLoading(true);
    deleteThing(props.thing._id)
      .then((_: any) => {
        if (props.onThingDelete) props.onThingDelete(props.thing._id);
        setLoading(false);
        setShowConfirm(false);
      })
      .catch((_: any) => {
        setLoading(false);
        alert(true, "Please try again...");
      });
  };

  const fetchComments = () => {
    setCommentsLoading(true);
    getComments(props.thing._id)
      .then((comments: Comment[]) => {
        setComments(comments);
        setCommentsLoading(false);
        setShowComments(true);
      })
      .catch((_: any) => {
        setCommentsLoading(false);
        alert(true, "Please try again...");
      });
  };

  const recurseCommentUpdate = (comment: Comment, comments: Comment[]): any => {
    let newComments: Comment[] = [...comments];
    let updated = false;
    for (let i = 0; i < newComments.length; i++) {
      if (newComments[i]._id === comment._id) {
        newComments[i] = comment;
        return [true, newComments];
      } else {
        let result = recurseCommentUpdate(comment, newComments[i].comments);
        newComments[i].comments = result[1];
        if (result[0]) return [true, newComments];
        else if (newComments[i]._id === comment.commentId) {
          newComments[i].comments.push(comment);
        }
      }
    }
    return [updated, newComments];
  };

  const onCommentUpdate = (comment: Comment) => {
    if (comment && comment._id) {
      let result = recurseCommentUpdate(comment, comments);
      if (!result[0] && !comment.commentId) result[1].push(comment);
      setComments(result[1]);
      alert(false, result[0] ? "Comment updated!" : "Comment created!");
    }
  };

  const recurseCommentDelete = (commentId: string, comments: Comment[]) => {
    let updatedComments = [];
    for (let c of [...comments])
      if (c._id !== commentId) updatedComments.push(c);
    if (updatedComments.length === comments.length)
      for (let c of updatedComments)
        c.comments = recurseCommentDelete(commentId, c.comments);
    return updatedComments;
  };

  const onCommentDelete = (commentId: string) => {
    if (!commentId) return;
    let updatedComments = recurseCommentDelete(commentId, comments);
    setComments(updatedComments);
    alert(false, "Comment deleted!");
  };

  return (
    <div className="card">
      <div className="thing-card">
        <div className="card-title">
          <b>{props.thing.name}</b>
        </div>
        <div className="thing-id">
          <b>SN:</b>&nbsp;{props.thing._id}
        </div>
        {props.operators.length > 0 && (
          <div>
            <b>Associated Operator(s):&nbsp;</b>
            {(() => {
              let operatorsString = "";
              let associatedOperators = props.operators.filter((operator) =>
                props.thing.operatorIds.includes(operator._id)
              );
              for (const operator of associatedOperators)
                operatorsString += operator.name + ", ";
              operatorsString = operatorsString.substring(
                0,
                operatorsString.length - 2
              );
              if (associatedOperators.length === 0) return "None";
              else return operatorsString;
            })()}
          </div>
        )}
        <IconButton
          id="card-delete"
          img={<CloseOutlined />}
          onClick={() => setShowConfirm(true)}
          disabled={!isAuthAtLeast(user, UserRole.ADMIN)}
        />
        <IconButton
          id="card-edit"
          img={<Edit />}
          onClick={() => setShowThingModal(true)}
          disabled={!isAuthAtLeast(user, UserRole.ADMIN)}
        />
        <IconButton
          id="card-comment"
          img={
            showComments ? <CommentsDisabledOutlined /> : <CommentOutlined />
          }
          onClick={() =>
            showComments ? setShowComments(false) : fetchComments()
          }
          loading={commentsLoading}
          disabled={!isAuthAtLeast(user, UserRole.MEMBER)}
        />
      </div>
      <ConfirmModal
        title={
          "Are you sure you want to delete Thing '" + props.thing.name + "'?"
        }
        show={showConfirm}
        toggle={() => setShowConfirm(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <ThingModal
        show={showThingModal}
        toggle={(thing: Thing) => {
          if (props.onThingUpdate) props.onThingUpdate(thing);
          setShowThingModal(false);
        }}
        thing={props.thing}
        operators={props.operators}
      />
      <Alert
        title={alertError ? "Something went wrong..." : "Success!"}
        description={alertDescription}
        color={alertError ? "red" : "green"}
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
      {showComments && (
        <CommentView
          contextId={props.thing._id}
          comments={comments}
          type={CommentType.THING}
          onUpdate={onCommentUpdate}
          onDelete={onCommentDelete}
        />
      )}
    </div>
  );
};
