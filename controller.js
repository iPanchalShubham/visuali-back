import axios from "axios";
import { allEmotions, cumulativeEmotions } from "./utils.js";
import { comData } from "./array.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

export const getComments = async (id) => {
  console.log(id);
  let cursor = "";
  const options = {
    method: "GET",
    url: process.env.YOUTUBE_DATA_API,
    params: {
      id: `${id}`,
      next: cursor,
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_TOKEN,
      "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
    },
  };

  try {
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
    } while (cursor);
    return { message: "retrived successfully", data: comments, status: 200 };
  } catch (error) {
    return { message: error.message, data: [], status: 500 };
  }
};

export const evaluateComments = async (comments) => {
  console.log(comments);
  try {
    if (comments.status !== 200 || comments.data.length === 0) {
      return {
        message: "No comments found",
        data: [],
        status: 500,
      };
    } else {
      comments = comments.data;
      let evalComments = [];
      const maxBatchLength = 10;
      if (comments.length >= maxBatchLength) {
        // divide the comments into bataches of maxBatchLength (i.e 70) or less
        for (let i = 0; i <= Math.ceil(comments.length / maxBatchLength); i++) {
          const rawComments = comments.slice(
            i * maxBatchLength,
            maxBatchLength * (i + 1)
          );
          console.log(rawComments);
          const resp = await axios
            .post(
              "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa",
              JSON.stringify(rawComments),
              {
                headers: {
                  Authorization: `Bearer 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`,
                },
              }
            )
            .catch((error) => {
              return {
                message: `${error} from axios eval comments`,
                data: [],
                status: 500,
              };
            });
          console.log("Eval comments");
          // Push the batch into evaluated comments
          const data = await resp?.data;

          if (data && resp?.status === 200) {
            // Connect all raw comments to their emotion
            for (let i = 0; i < data.length; i++) {
              console.log(data.length === rawComments.length);
              data[i].push([rawComments[i]]);
            }
            // push batch of data (which consists of the comments and emotion)
            evalComments.push(data);
          }
        }
      } else {
        // Simply analyse comments
        const resp = await axios
          .post(
            "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa",
            JSON.stringify(comments),
            {
              headers: {
                Authorization: `Bearer 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`,
              },
            }
          )
          .catch((error) => {
            return {
              message: `${error.message} from axios eval comments`,
              data: [],
              status: 500,
            };
          });
        console.log("Eval comments");
        const data = await resp?.data;
        console.log(resp);
        // If no data recieved then send model is busy.
        if (data && resp?.status === 200) {
          // Connect all raw comments to their emotion
          for (let i = 0; i < data.length; i++) {
            data[i].push([comments[i]]);
          }
          // push batch of data (which consists of the comments and emotion)
          evalComments.push(data);
        } else {
          // res.json
          return {
            message: "Please try again model is busy",
            data: [],
            status: 500,
          };
        }
      }
      // flatten the array
      evalComments = evalComments.flat();
      console.log(evalComments);
      return {
        message: "Comments evaluated successfully",
        data: evalComments,
        status: 200,
      };
    }
  } catch (error) {
    return {
      message: `${error.message} from eval comments`,
      data: [],
      status: 500,
    };
  }
};

export const evaluateEmotion = async (allEmotionsFromResponse) => {
  /*
      frequency: no._of_times_emotion_appeared_in_the_comment / no._of_comments_analysed
  
      intensity: total_value_of_emotion / no._of_times_emotion_appeared
      */

  // All emotions added up altogether
  if (
    allEmotionsFromResponse.data.length === 0 ||
    allEmotionsFromResponse.status === 500
  ) {
    return { message: "Model is busy.", data: [], status: 500 };
  }
  allEmotionsFromResponse = allEmotionsFromResponse.data;
  let total_value_of_all_emotion = 0;

  /*
  // Iterate the emotions containing array
 i.e this one ==> [
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object], [Object], [Object],
      [Object]
    ]
  ]

  */
  for (let i = 0; i < allEmotionsFromResponse.length; i++) {
    /*
    // iterate the emotion containing array
                    [
i.e this one ==> [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object], [Object], [Object],
                 [Object]
                  ]
                ]
    */
    console.log(allEmotionsFromResponse);
    for (let j = 0; j < allEmotionsFromResponse[i].length; j++) {
      // If the score is significant enough
      if (allEmotionsFromResponse[i][j].score > 0.5) {
        // Increase the frequency
        cumulativeEmotions[allEmotionsFromResponse[i][j].label].frequency += 1;
        total_value_of_all_emotion += allEmotionsFromResponse[i][j].score;
        // Add associated intensity
        cumulativeEmotions[allEmotionsFromResponse[i][j].label].intensity +=
          allEmotionsFromResponse[i][j].score;
        // Push the comment associated with the emotion
        cumulativeEmotions[allEmotionsFromResponse[i][j].label].comments.push(
          allEmotionsFromResponse[i][allEmotionsFromResponse[i].length - 1][0]
        );
      }
    }
    console.log(cumulativeEmotions);
  }
  // normalize the intensity and frequency
  for (let i = 0; i < 28; i++) {
    const emotions = cumulativeEmotions[allEmotions[i]];
    cumulativeEmotions[allEmotions[i]].intensity = emotions.frequency
      ? emotions.intensity / total_value_of_all_emotion
      : 0;
    cumulativeEmotions[allEmotions[i]].frequency =
      emotions.frequency / allEmotionsFromResponse.length;
  }

  const graphData = [];
  for (let i = 0; i < 28; i++) {
    const tempEmotionVar = {
      emotionName: allEmotions[i],
      intensity: cumulativeEmotions[allEmotions[i]].intensity,
      frequency: cumulativeEmotions[allEmotions[i]].frequency,
      comments: cumulativeEmotions[allEmotions[i]].comments,
    };
    graphData.push(tempEmotionVar);
  }
  // Sort the emotions
  graphData.sort(
    (a, b) => (b.frequency - a.frequency, b.intensity - a.intensity)
  );
  // Choosing top 5 most intense and frequent emotions
  graphData.length = 5;
  return { message: "Success", data: graphData, status: 200 };
};

export const vizData = async (req, res) => {
  try {
    const { id } = req.body;
    const comments = await getComments(id);
    const emotions = await evaluateComments(comments);
    console.log("emotions length is" + emotions.data.length);
    const evalEmotion = await evaluateEmotion(emotions);
    console.log(evalEmotion);
    if (evalEmotion.status !== 500) {
      res.json({
        message: `total ${comments.data.length} comments analysed `,
        data: evalEmotion.data,
        status: evalEmotion.status,
      });
    } else {
      res.json({
        message: evalEmotion.message,
        data: evalEmotion.data,
        status: evalEmotion.status,
      });
    }
  } catch (error) {
    res.json({
      message: `${error.message} from viz comments`,
      data: [],
      status: 500,
    });
  }
};
