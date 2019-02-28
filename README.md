# accelerate3D
PRIVATE REPO - NDA/NC/IPA AGREEMENT - CONFIDENTIAL AND PRIVATE

### Docker Deploy - App and Mongo
The project can be deployed using Docker.
You can obtain the latest version of Docker [here](https://docs.docker.com/install/overview/).

```bash
# Add -d to commandline to detach
# for headless operations

# build/deploy first run
cd ~
git clone https://github.com/sirmuzz/accelerate3D.git && cd ~/accelerate3D/new_source
docker-compose up --build

# after build/deploy
cd ~
git clone https://github.com/sirmuzz/accelerate3D.git && cd ~/accelerate3D/new_source
docker-compose up
