const axios = require("axios");

export async function getComments(data) {
  const options = {
    params: {
      query_hash: "bc3296d1ce80a24b1b6e40b1e72903f5",
      variables: { shortcode: data.shortcode, first: 50 },
    },
    headers: {
      cookie: `sessionid=${process.env.SESSION_ID}`,
    },
  };

  try {
    const comments = [];
    let page_info = {};
    const regex = /@w*/g;
    do {
      let response = {};
      try {
        response = await axios.get(
          "https://www.instagram.com/graphql/query/",
          options
        );
      } catch (err) {
        console.log(err);
      }
      if (response.data.data.shortcode_media === null) return; // Bad URL
      let edge_media_to_parent_comment =
        response.data.data.shortcode_media.edge_media_to_parent_comment;
      page_info = edge_media_to_parent_comment.page_info;
      let edges = edge_media_to_parent_comment.edges;

      if (data.tagCheck) {
        edges = edges.filter((edge) => edge.node.text.match(regex));
      }
      comments.push(...edges);

      options.params.variables.after = page_info.end_cursor; // change query params to point to next page
    } while (page_info.has_next_page);

    const formattedComments = comments.map((edge) => ({
      date: new Date(edge.node.created_at * 1000),
      user: edge.node.owner.username,
      comment: edge.node.text,
    }));

    // sort function
    formattedComments.sort((a, b) => {
      return a.date - b.date;
    });

    let csvContent = convertToCSV(formattedComments);
    return csvContent;
  } catch (err) {
    console.error(err);
  }
}

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}
