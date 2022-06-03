// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Jonathan Breidfjord

import React, { useState } from "react";
import {
  CloseOutlined,
  Edit,
  FileDownloadOutlined,
  CommentOutlined,
  CommentsDisabledOutlined,
} from "@mui/icons-material";
import { IconButton, Alert } from "components/interface";
import {
  Session,
  Collection,
  Comment,
  Thing,
  Operator,
  isAuthAtLeast,
  UserRole,
  useAppSelector,
  RootState,
  CommentType,
} from "state";
import { CommentView } from "./commentView";
import { deleteSession, getComments, downloadSessionFile } from "crud";
import { ConfirmModal } from "components/modals";
import { SessionModal } from "../modals/sessionModal";
import download from "downloadjs";
import "./_styling/sessionCard.css";

interface SessionCardProps {
  thing: Thing;
  session: Session;
  collections: Collection[];
  operators: Operator[];
  onUpdate: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = (
  props: SessionCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const onDelete = () => {
    setDeleteLoading(true);
    deleteSession(props.session._id)
      .then(() => {
        setDeleteLoading(false);
        props.onDelete(props.session._id);
      })
      .catch((_: any) => {
        setDeleteLoading(false);
        setShowAlert(true);
      });
  };

  const fetchComments = () => {
    setCommentsLoading(true);
    getComments(props.session._id)
      .then((comments: Comment[]) => {
        comments.sort((a: Comment, b: Comment) => a.lastUpdate - b.lastUpdate);
        setComments(comments);
        setCommentsLoading(false);
        setShowComments(true);
      })
      .catch((_: any) => {
        setCommentsLoading(false);
        setShowAlert(true);
      });
  };

  const onCommentUpdate = (comment: Comment) => {
    if (comment && comment._id) {
      let updatedComments = [...comments];
      let updated = false;
      for (let i in comments) {
        if (updatedComments[i]._id === comment._id) {
          updatedComments[i] = comment;
          updated = true;
        }
      }
      if (!updated) updatedComments.push(comment);
      updatedComments.sort(
        (a: Comment, b: Comment) => a.lastUpdate - b.lastUpdate
      );
      setComments(updatedComments);
      alert(false, updated ? "Comment updated!" : "Comment created!");
    }
  };

  const onCommentDelete = (commentId: string) => {
    if (!commentId) return;
    let updatedComments = [];
    for (let comment of comments)
      if (comment._id !== commentId) updatedComments.push(comment);
    setComments(updatedComments);
    alert(false, "Comment deleted!");
  };

  const downloadFile = () => {
    setDownloading(true);
    downloadSessionFile(props.session._id)
      .then((blob: any) => {
        download(blob, props.session.name + ".csv", "text/csv");
        setDownloading(false);
      })
      .catch((_: any) => {
        setDownloading(false);
        alert(true, "Failed to download file. Please try again...");
      });
  };

  return (
    <div className="card">
      <div className="session-card">
        <div className="card-title">
          <b>{props.session.name}</b>
        </div>
        <div>
          <b>Start Time:&nbsp;</b>
          {convertUnixTime(props.session.startTime)}
        </div>
        <div>
          <b>End Time:&nbsp;</b>
          {props.session.endTime
            ? convertUnixTime(props.session.endTime)
            : "IN PROGRESS"}
        </div>
        {props.session.collectionId && (
          <div>
            <b>Collection:&nbsp;</b>
            {
              props.collections.filter(
                (c) => c._id === props.session.collectionId
              )[0].name
            }
          </div>
        )}
        {props.session.operatorId && (
          <div>
            <b>Operator:&nbsp;</b>
            {
              props.operators.filter(
                (o) => o._id === props.session.operatorId
              )[0].name
            }
          </div>
        )}
        {isAuthAtLeast(user, UserRole.LEAD) && (
          <>
            <IconButton
              id="session-card-delete"
              img={<CloseOutlined />}
              onClick={() => setShowConfirmModal(true)}
            />
            <IconButton
              id="session-card-edit"
              img={<Edit />}
              onClick={() => setShowModal(true)}
            />
          </>
        )}
        {isAuthAtLeast(user, UserRole.MEMBER) && (
          <>
            <IconButton
              id="session-card-download"
              img={<FileDownloadOutlined />}
              onClick={() => downloadFile()}
              loading={downloading}
              disabled={props.session.endTime ? false : true}
            />
            <IconButton
              id="session-card-comment"
              img={
                showComments ? (
                  <CommentsDisabledOutlined />
                ) : (
                  <CommentOutlined />
                )
              }
              onClick={() =>
                showComments ? setShowComments(false) : fetchComments()
              }
              loading={commentsLoading}
            />
          </>
        )}
        <ConfirmModal
          title={
            "Are you sure you want to delete Session '" +
            props.session.name +
            "'?"
          }
          show={showConfirmModal}
          toggle={() => setShowConfirmModal(false)}
          onConfirm={onDelete}
          loading={deleteLoading}
        />
        {showModal && (
          <SessionModal
            show={showModal}
            toggle={(session: Session) => {
              if (session) props.onUpdate(session);
              setShowModal(false);
            }}
            thing={props.thing}
            session={props.session}
            collections={props.collections}
            operators={props.operators}
          />
        )}
        <Alert
          title={alertError ? "Something went wrong..." : "Success"}
          description={alertDescription}
          color={alertError ? "red" : "green"}
          onDismiss={() => setShowAlert(false)}
          show={showAlert}
          slideOut
        />
      </div>
      {showComments && (
        <CommentView
          contextId={props.session._id}
          comments={comments}
          type={CommentType.SESSION}
          onUpdate={onCommentUpdate}
          onDelete={onCommentDelete}
        />
      )}
    </div>
  );
};

const convertUnixTime = (unixTimestamp: number) => {
  var date = new Date(unixTimestamp);
  return date.toLocaleString();
};
