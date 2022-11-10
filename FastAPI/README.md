## Run the docker file


### We build ur docker env

docker build -t my-python-server .

### We run ur docker env

docker run -d --name mycontainer -p 80:80 server
