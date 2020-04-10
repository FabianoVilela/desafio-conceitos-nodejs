const express = require("express");

const routes = express.Router();
const { uuid } = require("uuidv4");

const repositories = [];

// Middleware
function repositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository not found" });

  return next();
}

routes.get("/repositories", (request, response) => {
  return response.json(repositories);
});

routes.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

routes.put("/repositories/:id", repositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);
  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

routes.delete("/repositories/:id", repositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

routes.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);
  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.json(repository);
});

module.exports = routes;
