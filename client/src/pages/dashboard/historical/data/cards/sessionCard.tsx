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
} from "state";
import { deleteSession, getComments } from "crud";
import { ConfirmModal } from "components/modals";
import { SessionModal } from "../modals/sessionModal";
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
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

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
        setComments(comments);
        setCommentsLoading(false);
        setShowComments(true);
      })
      .catch((_: any) => {
        setCommentsLoading(false);
        setShowAlert(true);
      });
  };

  const downloadFile = () => {
    // TODO
  };

  return (
    <div className="card session-card">
      <div className="card-title">
        <b>{props.session.name}</b>
      </div>
      <div>
        <b>Start Time:&nbsp;</b>
        {convertUnixTime(props.session.startTime)}
      </div>
      <div>
        <b>End Time:&nbsp;</b>
        {convertUnixTime(props.session.endTime)}
      </div>
      {isAuthAtLeast(user, UserRole.LEAD) && (
        <>
          <IconButton
            id="session-card-delete"
            img={<CloseOutlined />}
            onClick={() => setShowConfirmationModal(true)}
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
          />
          <IconButton
            id="session-card-comment"
            img={
              showComments ? <CommentsDisabledOutlined /> : <CommentOutlined />
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
        show={showConfirmationModal}
        toggle={() => setShowConfirmationModal(false)}
        onConfirm={onDelete}
        loading={deleteLoading}
      />
      <SessionModal
        show={showModal}
        toggle={() => setShowModal(false)}
        thing={props.thing}
        session={props.session}
        collections={props.collections}
        operators={props.operators}
      />
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
  var date = new Date(unixTimestamp * 1000);
  var dmy = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  return (
    dmy + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2)
  );
};
