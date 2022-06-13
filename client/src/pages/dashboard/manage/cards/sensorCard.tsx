// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import React, { useState } from "react";
import { IconButton, Alert } from "components/interface";
import {
  CloseOutlined,
  Edit,
  CommentOutlined,
  CommentsDisabledOutlined,
} from "@mui/icons-material";
import { CommentView } from "components/cards";
import {
  Sensor,
  useAppSelector,
  RootState,
  isAuthAtLeast,
  UserRole,
  Thing,
  Comment,
  CommentType,
} from "state";
import { SensorModal } from "../modals/sensorModal";
import { ConfirmModal } from "components/modals";
import { deleteSensor, getComments } from "crud";
import { numberToHex, sensorTypes } from "state";

interface SensorCardProps {
  sensor: Sensor;
  thing: Thing;
  onSensorUpdate?: (sensor: Sensor) => void;
  onSensorDelete?: (sensorId: string) => void;
}

export const SensorCard: React.FC<SensorCardProps> = (
  props: SensorCardProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [showSensorModal, setShowSensorModal] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const fetchComments = () => {
    setCommentsLoading(true);
    getComments(props.sensor._id)
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

  const onDelete = () => {
    setLoading(true);
    deleteSensor(props.sensor._id)
      .then((_: any) => {
        if (props.onSensorDelete) props.onSensorDelete(props.sensor._id);
        setLoading(false);
        setShowConfirm(false);
      })
      .catch((_: any) => {
        setLoading(false);
        alert(true, "Please try again...");
      });
  };

  return (
    <div className="card">
      <div className="sensor-card">
        <div className="card-title">
          <b>{props.sensor.name}</b>
        </div>
        <div>
          <b>Can ID:&nbsp;</b>
          0x{numberToHex(props.sensor.canId).toUpperCase()}
        </div>
        <div>
          <b>Can Offset:&nbsp;</b>
          {props.sensor.canOffset}&nbsp;bytes
        </div>
        <div>
          <b>Frequency:&nbsp;</b>
          {props.sensor.frequency}
        </div>
        <div>
          <b>Unit:&nbsp;</b>
          {props.sensor.unit ? props.sensor.unit : "N/A"}
        </div>
        <div>
          <b>Data Type:&nbsp;</b>
          {(() => {
            let description = ";";
            let type = props.sensor.type;
            let doubles = ["f", "d"];
            if (doubles.includes(type))
              description =
                "Decimal, " + (type === "f" ? "7" : "15") + " point precision";
            else if (type === "?") description = "On/Off";
            else description = "Discrete";
            // @ts-ignore
            return description + " (" + sensorTypes[type] + ")";
          })()}
        </div>
        <div>
          <b>Lower Bound:&nbsp;</b>
          {props.sensor.lowerBound}
        </div>
        <div>
          <b>Upper Bound:&nbsp;</b>
          {props.sensor.upperBound}
        </div>
        <div>
          <b>Lower Warning:&nbsp;</b>
          {props.sensor.lowerWarning ? props.sensor.lowerWarning : "N/A"}
        </div>
        <div>
          <b>Upper Warning:&nbsp;</b>
          {props.sensor.upperWarning ? props.sensor.upperWarning : "N/A"}
        </div>
        <div>
          <b>Lower Danger:&nbsp;</b>
          {props.sensor.lowerDanger ? props.sensor.lowerDanger : "N/A"}
        </div>
        <div>
          <b>Upper Danger:&nbsp;</b>
          {props.sensor.upperDanger ? props.sensor.upperDanger : "N/A"}
        </div>
        <IconButton
          id="card-delete"
          img={<CloseOutlined />}
          onClick={() => setShowConfirm(true)}
          disabled={!isAuthAtLeast(user, UserRole.ADMIN)}
        />
        <IconButton
          id="card-edit"
          img={<Edit />}
          onClick={() => setShowSensorModal(true)}
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
          "Are you sure you want to delete Sensor '" + props.sensor.name + "'?"
        }
        show={showConfirm}
        toggle={() => setShowConfirm(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <SensorModal
        show={showSensorModal}
        toggle={(sensor: Sensor) => {
          if (props.onSensorUpdate) props.onSensorUpdate(sensor);
          setShowSensorModal(false);
        }}
        sensor={props.sensor}
        thing={props.thing}
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
          contextId={props.sensor._id}
          comments={comments}
          type={CommentType.SENSOR}
          onUpdate={onCommentUpdate}
          onDelete={onCommentDelete}
        />
      )}
    </div>
  );
};
