
# Mischketainment Setup Guide

## GENERAL

Install Git and clone the repository:

```bash
sudo apt install git
git clone https://github.com/Tim-Pet/mischketainment.git   # Public clone
cd mischketainment
```

---

## BACKEND

### Install Packages to Run Backend

```bash
cd backend
sudo apt install python3-venv python3-pip
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors
```

### Create Upload Folder and Set Permissions

```bash
mkdir -p ~/uploads
chmod 755 ~/uploads
```

> **Note:** If you're using an HDD, use the HDD path:

```bash
mkdir -p /media/pi/yourlabel/uploads
sudo chown -R pi:pi /media/pi/yourlabel/uploads
chmod -R 755 /media/pi/yourlabel/uploads
```

Replace `pi` with your username if necessary.

### Modify `app.py`

Open the file:

```bash
nano app.py
```

Update the following line:

```python
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
```

To:

```python
UPLOAD_DIR = os.path.expanduser("~/uploads")
```

Or, for custom HDD path:

```python
UPLOAD_DIR = os.path.join("/media/pi", "yourlabel", "uploads")
```

---

### Install Node.js (for Frontend Build)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:

```bash
node -v
npm -v
```

Expected output:

```
v20.x.x
9.x.x (or higher)
```

---

## FRONTEND

### Setup

adjust network url for fetches:

```bash
const response = await fetch('http://<YOUR_PI_IP>:3111/upload', {
        method: 'POST',
        body: formData,
      });
```

```bash
cd ~/mischketainment/frontend
npm i
npm run build
```

### Verify Build

```bash
ls dist
```

Expected output:

```
assets  index.html  vite.svg
```

---

## Make Site Accessible

### Install & Test NGINX

```bash
sudo apt install nginx
sudo nginx -t
```

Expected output:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Verify folder exists:

```bash
ls /etc/nginx
```

---

### Configure NGINX

Create a new site config:

```bash
sudo nano /etc/nginx/sites-available/mischketainment
```

Paste in:

```nginx
server {
    listen 80;
    server_name _;

    root /home/<username>/projects/app/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /upload {
        proxy_pass http://127.0.0.1:3111/upload;
    }
}
```

Enable site config:

```bash
sudo ln -s /etc/nginx/sites-available/mischketainment /etc/nginx/sites-enabled/
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

> If the NGINX welcome page is still showing, run:

```bash
sudo rm /etc/nginx/sites-enabled/default
```


Make App Accessible in the internet:
Get [Cloudflare account](dash.cloudflare.com) (to not touch router & port forwarding)

install cloudflare tunnel on PI
```bash
sudo apt install cloudflared
```
on some OS this isn't available. do this then:get .deb file for your OS (in this example ARM64)
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb
cloudflared --version
```

login:
```bash
cloudflared tunnel login
```
create tunnel config:
```bash
nano ~/.cloudflared/config.yml
```

paste there:
```yaml
tunnel: mischketainment
credentials-file: /home/pi/.cloudflared/mischketainment.json

ingress:
  - hostname: mischketainment.copyandpaste.dev
    service: http://localhost:80
  - service: http_status:404
```

route dns to tunel:
```bash
cloudflared tunnel route dns mischketainment mischketainment.copyandpaste.dev
```


Authenticate & create a tunnel
```bash
cloudflared tunnel login
cloudflared tunnel create mischketainment
```

Run tunnel with
```bash
cloudflared tunnel run mischketainment
```
---

## On Folder Moves

Recreate and reactivate Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors
```
