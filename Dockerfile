# Use an appropriate base image
FROM node:22

# Create the /input directory
RUN mkdir /input

# For local testing
# docker run -v D:/POC/pub-poc/demo/input:/input -v D:/POC/pub-poc/demo/output:/output -v D:/POC/pub-poc/demo/sealed:/sealed my-docker-image

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the script
CMD ["node", "main.js"]