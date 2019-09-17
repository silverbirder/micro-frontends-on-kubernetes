# micro-frontends-in-kubernetes
micro frontends application works in kubernetes

fork by https://github.com/neuland/micro-frontends

# Usage
## My Env
```
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.14.6
BuildVersion:	18G84
$ docker -v
Docker version 19.03.1, build 74b1e89
```

## Install
### minikube
use [minikube](https://github.com/kubernetes/minikube) for single cluster or single node

``` bash
$ brew cask install minikube
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-hyperkit \
  && sudo install -o root -m 4755 docker-machine-driver-hyperkit /usr/local/bin/
$ minikube start --vm-driver=hyperkit
$ eval $(minikube docker-env)
```

### kind
use [kind](https://github.com/kubernetes-sigs/kind) for multi clusters or multi nodes

```bash
$ brew install go
$ go version
go version go1.13 darwin/amd64
$ PATH=${PATH}:$(go env GOPATH)/bin
$ kind create cluster
$ export KUBECONFIG="$(kind get kubeconfig-path --name="kind")"
```

## Build & Load
```bash
$ cd team-blue && docker build -t team-blue . && cd ..
$ cd team-green && docker build -t team-green . && cd ..
$ cd team-red && docker build -t team-red . && cd ..
$ cd team-nginx && docker build -t team-nginx . && cd ..
```

※ The yaml files was generated using [kompose](https://github.com/kubernetes/kompose)

next step is for kind
```bash
$ kind load docker-image team-blue:1.0.0
$ kind load docker-image team-green:1.0.0
$ kind load docker-image team-red:1.0.0
$ kind load docker-image team-nginx:1.0.0
```
### skaffold

[skaffold](https://github.com/GoogleContainerTools/skaffold) is 
> Easy and Repeatable Kubernetes Developmen

I use it for minikube

```
$ brew install skaffold
$ skaffold dev  --port-forward
```
## Database

```bash
$ kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never -- mysql -h mysql-0.mysql <<EOF
CREATE DATABASE web;
EOF

$ kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never -- mysql -h mysql-0.mysql <<EOF
CREATE TABLE web.teamGreenRelatedProducts (sku varchar(255), related_sku_id int);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_porsche', 3);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_porsche', 5);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_porsche', 6);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_fendt', 3);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_fendt', 6);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_fendt', 4);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_eicher', 1);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_eicher', 8);
INSERT INTO web.teamGreenRelatedProducts VALUES ('t_eicher', 7);
EOF

$ kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never -- mysql -h mysql-0.mysql <<EOF
CREATE TABLE web.teamRedProducts (product_name varchar(255), sku varchar(255), color varchar(255), sku_name varchar(255), image varchar(255), thumb varchar(255), price varchar(255));
INSERT INTO web.teamRedProducts VALUES ('Tractor', 't_porsche', 'red', 'Porsche-Diesel Master 419', '/red/images/tractor-red.jpg', '/red/images/tractor-red-thumb.jpg', '66,00');
INSERT INTO web.teamRedProducts VALUES ('Tractor', 't_fendt', 'green', 'Fendt F20 Dieselroß', '/red/images/tractor-green.jpg', '/red/images/tractor-green-thumb.jpg', '54,00');
INSERT INTO web.teamRedProducts VALUES ('Tractor', 't_eicher', 'blue', 'Eicher Diesel 215/16', '/red/images/tractor-blue.jpg', '/red/images/tractor-blue-thumb.jpg', '58,00');
EOF
```

## Apply
```bash
$ find . -name "*.yaml" | grep -v "skaffold.yaml" |xargs -I {} kubectl apply -f {}
$ kubectl port-forward $(k get pods | grep nginx | awk '{print $1}') 3000:3000
```

## Delete
```bash
$ find . -name "*.yaml"|xargs -I {} kubectl delete -f {}
```

next step is for kind
```bash
$ kind delete cluster --name kind
```

```bash
$ docker images | grep "team-" | awk '{print $3}' | xargs docker rmi -f 
```
