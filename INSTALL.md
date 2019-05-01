docker build -t quasar .

docker run -v /media/rparry2/DD_Website/verto:/verto -p 3000:3000 -it quasar /bin/bash