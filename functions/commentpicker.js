const axios = require("axios");
const stringify = require("csv-stringify/lib/sync");

export async function getComments(data) {
  const options = {
    params: {
      query_hash: data.query_hash,
      variables: { shortcode: data.shortcode, first: 50 },
    },
  };

  const comments = [];
  let page_info = {};

  try {
    do {
      let response = await axios.get(
        "https://www.instagram.com/graphql/query/",
        options
      );
      if (response.data.data.shortcode_media === null) return; // Bad URL
      let edge_media_to_parent_comment =
        response.data.data.shortcode_media.edge_media_to_parent_comment;
      if (edge_media_to_parent_comment.count > 10000) {
        // current limit of 10k comments (200 requests)
        return null;
      }
      page_info = edge_media_to_parent_comment.page_info;
      let edges = edge_media_to_parent_comment.edges;

      if (data.tagCheck) {
        edges = edges.filter((edge) => edge.node.text.match(/@w*/g));
      }
      comments.push(...edges);

      options.params.variables.after = page_info.end_cursor; // change query params to point to next page
    } while (page_info.has_next_page);

    const formattedComments = comments.map((edge) => ({
      date: new Date(edge.node.created_at * 1000),
      user: edge.node.owner.username,
      comment: edge.node.text.replace(/\n/g, " "),
    }));

    // sort function
    formattedComments.sort((a, b) => {
      return a.date - b.date;
    });

    const result = stringify(
      formattedComments,
      {
        cast: {
          date: function (value) {
            return value.toString();
          },
        },
        header: true,
      },
      (err) => {
        if (err) {
          return;
        }
      }
    );
    return result;
  } catch (err) {
    return;
  }
}
