/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
const path = "http://localhost:8081/api";

async function get(url) {
  const response = await fetch(`${path}${url}`);
  const models = response.json();
  return models;
}

async function post(url, obj) {
  const response = await fetch(`${path}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(obj),
  });

  const data = await response.json();

  return data;
}

const fetchModel = {
  get: get,
  post: post,
};

export default fetchModel;
