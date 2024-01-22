import moment from "moment";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, editComment } from "../../actions/comments";
import { hatefulWords, harmfulWords, spamWords } from './autoDeleteWords';
import  Papa  from "papaparse";

import "./comments.css";
function DisplayComments({
  cId,
  commentBody,
  userId,
  commentOn,
  userCommented,
}) {
  const [Edit, setEdit] = useState(false);
  const [cmtBdy, setcmtBdy] = useState("");
  const [cmtId, setcmtId] = useState("");
  const [badWords, setBadWords] = useState([]);

  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('./badWords.csv'); 
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: false });
      const words = parsedData.data.map((row) => row[0].toLowerCase());
      setBadWords(words);
    };

    fetchData();
  }, []);


  const handleEdit = (ctId, ctBdy) => {
    setEdit(true);
    setcmtId(ctId);
    setcmtBdy(ctBdy);
  };

  const dispatch = useDispatch();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!cmtBdy) {
      alert("Type Your comments");
    } else {
      dispatch(
        editComment({
          id: cmtId,
          commentBody: cmtBdy,
        })
      );
      setcmtBdy("");
    }
    setEdit(false);
  };
  const handleDel=(id)=>{
    dispatch(deleteComment(id))
  }

  const containsBadWord = badWords.some((word) =>
  commentBody.toLowerCase().includes(word)
);

  return (
    <>
      {Edit ? (
        <>
          <form
            className="comments_sub_form_comments"
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              onChange={(e) => setcmtBdy(e.target.value)}
              placeholder="Edit comment..."
              value={cmtBdy}
              className="comment_ibox"
            />
            <input
              type="submit"
              value="Change"
              className="comment_add_btn_comments"
            />
          </form>
        </>
      ) : (

        

        <>
        {hatefulWords.some(word => commentBody.toLowerCase().includes(word)) ||
         harmfulWords.some(word => commentBody.toLowerCase().includes(word)) ||
         spamWords.some(word => commentBody.toLowerCase().includes(word)) ||
         containsBadWord ? (
          <p className="comment_body">
            Comment contains inappropriate content and is deleted.
          </p>
        ) : (
          <p className="comment_body">{commentBody}</p>
        )}
      </>
      )}


      <p className="usercommented">
        {" "}
        - {userCommented} commented {moment(commentOn).fromNow()}
      </p>
      {CurrentUser?.result._id === userId && (
        <p className="EditDel_DisplayCommendt">
          <i onClick={() => handleEdit(cId, commentBody)}>Edit</i>
          <i onClick={()=> handleDel(cId)} >Delete</i>
        </p>
      )}
    </>

  );
}

export default DisplayComments;


