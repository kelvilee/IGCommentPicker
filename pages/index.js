import Head from "next/head";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Layout from "../components/layout";
import URLField from "../components/URLField";
import { getComments } from "../functions/commentpicker";

export default function Home(args) {
  const [buttonState, setButtonState] = useState({
    status: "button-active",
    desc: "Download CSV",
    spinner: "hidden",
  });

  const handleSubmit = async (data) => {
    // get shortcode from URL
    const parser = document.createElement("a");
    parser.href = data.link;
    data.shortcode = parser.pathname.match(/[^\/p\/][\w\-\_]*/g);

    // invalid shortcode
    if (data.shortcode === null) {
      setButtonState({
        status: "button-invalid",
        desc: "Invalid Post",
        spinner: "hidden",
      });
      return;
    }
    data.shortcode = data.shortcode[0];
    data.query_hash = process.env.QUERY_HASH;
    setButtonState({
      status: "button-loading",
      desc: "Loading Comments..",
      spinner: "visible",
    });

    const comments = await getComments(data);

    if (comments === undefined) {
      // Post does not exist
      setButtonState({
        status: "button-invalid",
        desc: "Post Does Not Exist",
        spinner: "hidden",
      });
      return;
    } else if (comments === null) {
      setButtonState({
        status: "button-invalid",
        desc: "Over 10,000 Comments Limit",
        spinner: "hidden",
      });
      return;
    }

    // Comments retrieved
    setButtonState({
      status: "button-done",
      desc: "Done!",
      spinner: "hidden",
    });
    parser.href = "data:attachment/csv," + encodeURIComponent(comments);
    parser.target = "_blank";
    parser.download = "igCommentPicker.csv";
    document.body.appendChild(parser);
    parser.click();
  };

  return (
    <Layout>
      <div className="container">
        <Head>
          <title>IG Comment Picker</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1 className="title">IG Comment Picker</h1>

          <p className="description">
            Paste the post URL and generate the comments in a CSV file
          </p>
          <Formik
            initialValues={{ link: "", tagCheck: false }}
            validationSchema={Yup.object({
              link: Yup.string()
                .url("Invalid URL")
                .matches(
                  /(https?:\/\/(?:www\.)?instagram\.com\/p\/([^/?#&]+)).*/g,
                  "Invalid URL"
                )
                .required("URL is required"),
            })}
            onSubmit={(value) => {
              handleSubmit(value);
            }}
          >
            {(props) => {
              const { isSubmitting, handleSubmit } = props;
              return (
                <Form onSubmit={handleSubmit}>
                  <URLField name="link" type="url" />
                  <label className="tagCheckLabel">
                    <Field name="tagCheck" type="checkbox" />
                    Only include comments with @ tags
                  </label>
                  <button
                    id="submitBtn"
                    className={buttonState.status}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {buttonState.desc}
                  </button>
                  <a href="mailto:igcommentpicker@gmail.com">Feedback</a>
                  <div>
                    <div
                      className="spinner"
                      style={{ visibility: buttonState.spinner }}
                    >
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </main>
        <footer>
          <p>Powered by 🐨</p>
        </footer>

        <style jsx>{`
          button {
            display: block;
            width: 100%;
            padding: 1em 0;
            margin: 1em auto;
            font-size: 1.2em;
            color: white;
            border: none;
            cursor: pointer;
          }

          .button-active {
            background-color: green;
          }

          .button-invalid {
            background-color: gold;
            cursor: default;
          }

          .button-loading {
            background-color: gray;
            cursor: default;
          }

          .button-dne {
            background-color: red;
            cursor: default;
          }

          .button-done {
            background-color: #00ba88;
            cursor: default;
          }

          .tagCheckLabel {
            display: block;
            margin-top: 1em;
            text-align: center;
          }

          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            text-decoration: none;
            display: block;
            text-align: center;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          input {
            width: 300px;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }

          .spinner {
            margin: 100px auto 0;
            width: 70px;
            text-align: center;
          }

          .spinner > div {
            width: 18px;
            height: 18px;
            background-color: #333;

            border-radius: 100%;
            display: inline-block;
            -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            animation: sk-bouncedelay 1.4s infinite ease-in-out both;
          }

          .spinner .bounce1 {
            -webkit-animation-delay: -0.32s;
            animation-delay: -0.32s;
          }

          .spinner .bounce2 {
            -webkit-animation-delay: -0.16s;
            animation-delay: -0.16s;
          }

          @-webkit-keyframes sk-bouncedelay {
            0%,
            80%,
            100% {
              -webkit-transform: scale(0);
            }
            40% {
              -webkit-transform: scale(1);
            }
          }

          @keyframes sk-bouncedelay {
            0%,
            80%,
            100% {
              -webkit-transform: scale(0);
              transform: scale(0);
            }
            40% {
              -webkit-transform: scale(1);
              transform: scale(1);
            }
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </Layout>
  );
}

// export async function getStaticProps() {
//   return {
//     props: { query_hash: process.env.QUERY_HASH }, // will be passed to the page component as props
//   };
// }
