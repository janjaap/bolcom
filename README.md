# BOL.com multi-select filter code assessment

## Running

Code has been deployed to Vercel on:

- https://bolcom-web.vercel.app/: web app
- https://bolcom-apollo.vercel.app/: GraphQL server

## Installing

Requirements:

- pnpm latest
- Node 22
- Optionally: dev container in VSCode with the following configuration:

  ```json
  {
    "name": "bol.com multi-select code assessment",
    "image": "mcr.microsoft.com/devcontainers/base:bullseye",

    "customizations": {
      "vscode": {
        "extensions": [
          "christian-kohler.npm-intellisense",
          "dbaeumer.vscode-eslint",
          "EditorConfig.EditorConfig",
          "esbenp.prettier-vscode",
          "rvest.vs-code-prettier-eslint",
          "astro-build.astro-vscode"
        ]
      }
    },
    "features": {
      "ghcr.io/devcontainers-extra/features/pnpm:2": {},
      "ghcr.io/devcontainers/features/node:1": {
        "nodeGypDependencies": true,
        "installYarnUsingApt": true,
        "version": "lts",
        "nvmVersion": "latest"
      }
    },
    "runArgs": ["--network=host"],
    "postStartCommand": "git config --global --add safe.directory ${containerWorkspaceFolder};"
  }
  ```

Install dependencies:

```console
$ pnpm i
```

Run the dev server:

```console
$ pnpm dev
```

Run production env:

```console
$ pnpm build && pnpm preview
```

## Considerations

### Setup

The project has been set up with [Astro](https://astro.build/). This web framework is fast, UI-agnostic and serves zero JS by default. Ideal for rapid prototyping and integrating different libraries, like React.

## GraphQL

The GraphQL Apollo server is configured with javascript due to lack of time. Ideally this had been done with Typescript so that the schema can be typed and those types can be used in components in the web app.

## Styling

For styling, CSS modules are used. For a clean baseline, a simple CSS reset stylesheet has been applied.

## Filtering

Items from the JSON file are initially retrieved via GraphQL and then filtered on the client. For data that might change often, filtering should've been done by GraphQL as well, but seemed to convoluted for the scope of this assessment.

## Testing

Also because of lack of time, no tests have been written. For the `MultiSelect` React component, test cases have been added. With more time, I would've written tests for those cases which should cover the entire functionality of the component.
