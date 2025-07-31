# web_infrastructure_summative1_remote_jobs
Remote Jobs Web App Deployment with Load Balancing
What’s this about?
This project shows how I deployed a simple web app inside Docker containers running on two separate web servers (called Web01 and Web02). To make sure traffic gets shared between them, I set up an HAProxy load balancer (Lb01) that sends requests back and forth evenly. The app itself grabs remote job listings from the RemoteOK API and shows them nicely.

Docker Hub Repo Details
Docker Hub URL: https://hub.docker.com/repository/docker/yourusername/remote-jobs-web

Image name: yourusername/remote-jobs-web

Tags: latest, v1.0

(Remember to swap yourusername with your actual Docker Hub username!)

How to build the Docker image locally
From the project folder, run this command to build your image:

bash
Copy
Edit
docker build -t yourusername/remote-jobs-web:latest .
This uses the Dockerfile here to create a fresh image tagged as latest.

How to run Web01 and Web02 containers
On both web servers (Web01 and Web02), start the containers like this:

bash
Copy
Edit
docker run -d --name web-01 -p 8080:80 yourusername/remote-jobs-web:latest
docker run -d --name web-02 -p 8081:80 yourusername/remote-jobs-web:latest
Port 8080 will serve the app on Web01

Port 8081 will serve the app on Web02

This setup is simple — no extra environment variables or volumes needed here.

Setting up the Load Balancer (HAProxy on Lb01)
On the load balancer server (Lb01), I installed HAProxy and edited its config file at /etc/haproxy/haproxy.cfg. Here’s the important part:

haproxy
Copy
Edit
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
After saving the config, I reloaded HAProxy with:

bash
Copy
Edit
sudo systemctl restart haproxy
Testing if it works
Open a browser or use curl to visit the load balancer’s IP at port 80:

bash
Copy
Edit
curl -I http://<lb01-ip>:80
If you repeat the request a few times, the X-Served-By header should switch between web01 and web02 — showing load balancing in action.

You can also visit each server directly:

http://<web01-ip>:8080

http://<web02-ip>:8081

Bonus: Keeping secrets safe (optional)
If you ever use API keys or passwords, don’t bake them into the Docker image!

Instead:

Put them in a .env file on your host machine (make sure .env is in .gitignore so it doesn’t get pushed to GitHub)

Pass the variables at runtime with:

bash
Copy
Edit
docker run --env-file .env ...
In your app code, read those variables from the environment (e.g., using process.env in Node.js)

Challenges & What I Learned
Setting up Docker and user permissions took some trial to get right.

Figuring out the right container IPs for HAProxy to use needed some patience.

The RemoteOK API is pretty straightforward and easy to work with.

Thanks & Credits
RemoteOK API for the great remote job data

HAProxy — awesome open-source load balancer

Docker — made deploying containers a breeze

Wrap-up
This whole setup is a simple and clean example of deploying a web app on Docker containers, balanced nicely with HAProxy. Follow the steps above exactly, and you’ll be able to spin this up from scratch on your own machines.
