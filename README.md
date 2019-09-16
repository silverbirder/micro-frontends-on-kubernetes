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
Creating cluster "kind" ...
 ✓ Ensuring node image (kindest/node:v1.15.3) 🖼
 ✓ Preparing nodes 📦
 ✓ Creating kubeadm config 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Cluster creation complete. You can now use the cluster with:

export KUBECONFIG="$(kind get kubeconfig-path --name="kind")"
kubectl cluster-info
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
$ skaffold dev
```

## Apply
```bash
$ find . -name "*.yaml"|xargs -I {} kubectl apply -f {}
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
$ docker rmi \
  $(docker images | grep team-blue | awk '{print $3}') \
  $(docker images | grep team-green | awk '{print $3}') \
  $(docker images | grep team-red | awk '{print $3}') \
  $(docker images | grep team-nginx | awk '{print $3}')  
```
