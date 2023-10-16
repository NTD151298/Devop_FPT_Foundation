1. Deploy a working application:
- Clone ReactJS frontend repo: https://github.com/thai-nm/sample-webapp-reactjs.git
- Clone NodeJS backend repo: https://github.com/uet-app-distributor/sample-nodejs-webapp.git
- Change directory to the frontend repo and build your own image with the pre-provided Dockerfile. You should check for the Dockerfile and its build workflow to understand and review about multi-stage and image build process.
- Change directory to the backend repo and build your own image without seeing the pro-provided Dockerfile. After trying to build your own image or being get stuck, you can use the Dockerfile in the repository as a reference.
- Upload those new images to your own DockerHub account.
- Develop your own `compose.yml` file for Docker Compose to do the following:
  - Create a new network named `deployment-practice-network`
  - Create 2 services:
    - Service `backend` will create a container name `sample-webapp-nodejs` and refer to the backend image you just pushed above. This service requires environment variables: `USER=practioner-be` and `ENV=dev`. This service will only be exposed at port `13000` of the `loopback` interface and mapped to port `3000` of the container.
    - Service `frontend` will create a container name `sample-webapp-reactjs` and refer to the frontend image you just pushed above. This service requires environment variables: `USER=practioner-fe` and `ENV=dev`. This service will be exposed at port `18080` of the `0.0.0.0` interface and mapped to port `80` of the container.
  - Deploy with Docker Compose.
  - To check if the containers are working or not, open your browser and go to http://localhost:18080. Then click `Give me a quote`. If there is a quote sent to you, everything is working well!