// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { TextButton, TextArea, Alert } from "components/interface";
import { BaseModal } from "components/modals";
import { Comment, CommentType, RootState, useAppSelector } from "state";
import { postComment, putComment } from "crud";

interface CommentModalProps {
  show?: boolean;
  toggle: any;
  contextId: string;
  comment?: Comment;
  type: CommentType;
  reply?: boolean;
}

export const CommentModal: React.FC<CommentModalProps> = (
  props: CommentModalProps
) => {
  const user = useAppSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [text, setText] = useState<string>();

  useEffect(() => {
    if (props.comment && !props.reply) setText(props.comment.content);
  }, [props.comment]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const onSubmit = () => {
    if (text === "") {
      alert("Comment must have information.");
    } else {
      setLoading(true);
      if (props.comment && !props.reply) {
        const comment: any = { ...props.comment, content: text, comments: [] };
        putComment(comment)
          .then(() => {
            setLoading(false);
            props.toggle({ ...comment, comments: props.comment!.comments });
          })
          .catch((_: any) => {
            setLoading(false);
            alert("Please try again...");
          });
      } else {
        const comment: any = {
          userId: user!._id,
          username: user!.name,
          time: new Date().getTime(),
          content: text!,
          comments: [],
        };
        if (props.reply && props.comment)
          comment["commentId"] = props.comment?._id;
        comment[props.type] = props.contextId;
        postComment(comment)
          .then((comment: Comment) => {
            setLoading(false);
            props.toggle(comment);
          })
          .catch((_: any) => {
            setLoading(false);
            alert("Please try again...");
          });
      }
    }
  };

  return (
    <>
      <BaseModal
        title={
          props.comment
            ? props.reply
              ? "Reply to Comment"
              : "Edit Comment"
            : "New Comment"
        }
        show={props.show}
        toggle={props.toggle}
      >
        <TextArea
          value={text}
          onUpdate={setText}
          holder="Comment with velocity..."
        />
        <TextButton
          type="button"
          title="Save"
          onClick={onSubmit}
          loading={loading}
        />
      </BaseModal>
      <Alert
        title="Something went wrong..."
        description={alertDescription}
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};
