# accelerate3D
PRIVATE REPO - NDA/NC/IPA AGREEMENT - CONFIDENTIAL AND PRIVATE

### Docker Deploy - App and Mongo
The project can be deployed using Docker.  Installation using docker will also create the necessary MongoDB instance.

```bash
cd ~
git clone https://github.com/sirmuzz/accelerate3D.git && cd ~/accelerate3D/new_source

# Add -d to commandline to detach
# for headless operations

# build/deploy first run
docker-compose up --build
# -- OR --
# after build/deploy
docker-compose up
