import axios from "axios";

const getComments = async (url) => {
  // extract id from "https://www.youtube.com/watch?v=M-ZH3psUbfU"
  const pattern = url.match(/v=([^\&]+)/)[1];
  const id = url.match(pattern);
  let cursor = "";
  const options = {
    method: "GET",
    url: "https://youtube-search-and-download.p.rapidapi.com/video/comments",
    params: {
      id: `${id}`,
      next: cursor,
    },
    headers: {
      "X-RapidAPI-Key": "2218cbd39cmshd640f43b6f04d6bp13c21cjsn0412a3956de2",
      "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
    },
  };

  try {
    let i = 0;
    let response = await axios.request(options);
    const comments = [];
    do {
      for (let i = 0; i < response?.data.comments.length; i++) {
        const comment = response.data.comments[i].text;
        comments.push(comment);
      }
      //  Get the token to query the next page.
      cursor = await response.data.next;
      options.params.next = cursor;
      response = options.params.next ? await axios.request(options) : [];
      i++;
      console.log("comment page " + i + cursor);
    } while (cursor);
    console.log(comments.length);
    console.log({
      message: "retrived successfully",
      data: comments,
      status: 200,
    });
  } catch (error) {
    console.log({ message: error.message, data: [], status: 500 });
  }
};

console.log(getComments("https://www.youtube.com/watch?v=dEv99vxKjVI"));
