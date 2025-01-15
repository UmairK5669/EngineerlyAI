# Use the official Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /backend

# Copy project files into the container
COPY . /backend

# Install dependencies
RUN pip install -r requirements.txt

# Expose port 8080
EXPOSE 8080

# Run the application.
CMD ["python3", "app.py"]
