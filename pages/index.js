import Head from "next/head";
import { getComments } from "../lib/commentpicker";
import { useField, Formik, Form, Field } from "formik";
import * as Yup from "yup";

export default function Home() {
  const handleSubmit = async (data) => {
    const submitBtn = document.getElementById("submitBtn");
    const loadingGif = document.querySelector(".spinner");

    // get shortcode from URL
    const parser = document.createElement("a");
    parser.href = data.link;
    const shortcodeRegex = /[^\/p\/]\w*/g;
    data.shortcode = parser.pathname.match(shortcodeRegex);

    // invalid shortcode
    if (data.shortcode === null) {
      submitBtn.textContent = "Invalid Post";
      submitBtn.style.backgroundColor = "#808080";
      return;
    }

    data.shortcode = data.shortcode[0];
    submitBtn.textContent = "Loading Comments..";
    submitBtn.style.backgroundColor = "#808080";
    submitBtn.setAttribute("type", "button");
    loadingGif.style.visibility = "visible";
    const comments = await getComments(data);
    if (comments === undefined) {
      // Post does not exist
      submitBtn.textContent = "Post Does Not Exist";
      submitBtn.style.backgroundColor = "#FF0000";
      loadingGif.style.visibility = "hidden";
    } else {
      // Comments retrieved
      submitBtn.textContent = "Done!";
      submitBtn.style.backgroundColor = "#00ba88";
      loadingGif.style.visibility = "hidden";

      var a = document.createElement("a");
      a.href = "data:attachment/csv," + encodeURIComponent(comments);
      a.target = "_blank";
      a.download = "igCommentPicker.csv";
      document.body.appendChild(a);
      a.click();
    }
  };

  return (
    <div className="container">
      <Head>
        <title>IG Comment Picker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">IG Comment Picker</h1>

        <p className="description">
          Paste the post URL and generate the comments in a .CSV file!
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
                <label
                  style={{
                    display: "block",
                    marginTop: "1em",
                    textAlign: "center",
                  }}
                >
                  <Field name="tagCheck" type="checkbox" />
                  Only include comments with tags
                </label>
                <button
                  id="submitBtn"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "1em 0",
                    margin: "1em auto",
                    fontSize: "1.2em",
                    backgroundColor: "#00ba88",
                    color: "white",
                    border: "none",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Download .CSV
                </button>
                <a
                  href="mailto:igcommentpicker@gmail.com"
                  style={{ display: "block", textAlign: "center" }}
                >
                  Feedback
                </a>
                <div>
                  <div className="spinner" style={{ visibility: "hidden" }}>
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
        button[type="submit"] {
          cursor: pointer;
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

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
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
  );
}

const URLField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <>
      <input
        style={{ width: "23em", padding: "1em", textAlign: "center" }}
        placeholder="https://www.instagram.com/p/CB2ATDSl4Sh/"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};
