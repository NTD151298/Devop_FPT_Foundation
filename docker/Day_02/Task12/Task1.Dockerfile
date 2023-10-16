# Create a Dockerfile for a Python application that prints a message. 
# Build the image and run a container from it.

# Use the official Python image with version 3.9
FROM python:3.9
# Set the working diretory for file store in app file
WORKDIR /app
# Copy the exiten python script to the diretory in image
COPY task1.py .
# Run the python script that we just Copy
CMD ["python", "task1.py"]
