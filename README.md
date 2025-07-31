
**Remote Jobs Web App Deployment with Load Balancing**

**What’s this about?**

This project shows how I deployed a simple web app inside Docker containers running on two separate web servers (called Web01 and Web02). To make sure traffic gets shared between them, I set up an HAProxy load balancer (Lb01) that sends requests back and forth evenly. The app itself grabs remote job listings from the RemoteOK API and shows them nicely.

**Docker Hub Repo Details**

**Docker Hub URL:** https://hub.docker.com/repository/docker/yourusername/remote-jobs-web

**Image name:** yourusername/remote-jobs-web

**Tags:** latest, v1.0

(Remember to swap ```yourusername``` with your actual Docker Hub username!)

**How to build the Docker image locally**

From the project folder, run this command to build your image:

```docker build -t yourusername/remote-jobs-web:latest .```

This uses the ```Dockerfile``` here to create a fresh image tagged as ```latest```.

**How to run Web01 and Web02 containers**

On both web servers (Web01 and Web02), start the containers like this:

```docker run -d --name web-01 -p 8080:80 yourusername/remote-jobs-web:latest```
```docker run -d --name web-02 -p 8081:80 yourusername/remote-jobs-web:latest```

* Port ```8080``` will serve the app on Web01

* Port 8081 will serve the app on Web02

* This setup is simple; no extra environment variables or volumes needed here.

**Setting up the Load Balancer (HAProxy on Lb01)**

On the load balancer server (Lb01), I installed HAProxy and edited its config file at ```/etc/haproxy/haproxy.cfg```. Here’s the important part:

```
    global
    daemon
    maxconn 256

defaults
    mode http
    timeout connect 5s
    timeout client  50s
    timeout server  50s

frontend http-in
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    server web01 172.20.0.11:80 check
    server web02 172.20.0.12:80 check
    http-response set-header X-Served-By %[srv_name]
```

After saving the config, I reloaded HAProxy with:

```sudo systemctl restart haproxy```

**Testing if it works**

Open a browser or use curl to visit the load balancer’s IP at port 80:

```curl -I http://<lb01-ip>:80```

* If you repeat the request a few times, the ```X-Served-By``` header should switch between ```web01``` and ```web02```, showing load balancing in action.

You can also visit each server directly:

- ```http://<web01-ip>:8080```
- ```http://<web02-ip>:8081```
  
**Challenges & What I Learned**

* Setting up Docker and user permissions took some trial to get right(it was quite stressful as a beginner, to be very honest).

* The RemoteOK API is free and pretty straightforward and easy to work with(it doesn’t require any API Key, or OAuth).

**Thanks & Credits**
- RemoteOK API(https://remoteok.com/api) for the great remote job data and amazing API documentation.
