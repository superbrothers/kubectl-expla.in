FROM alpine

ADD bin/kubectl-explain /opt/kubectl-explain/bin/kubectl-explain

ENV KUBECTL_EXPLAIN_HTML_ASSETS /opt/kubectl-explain/assets
ADD assets/dist $KUBECTL_EXPLAIN_HTML_ASSETS

ENV K8S_VERSION v1.2.4
RUN apk add --update curl ca-certificates \
    && update-ca-certificates \
    && curl -o /opt/kubectl-explain/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/$K8S_VERSION/bin/linux/amd64/kubectl \
    && chmod +x /opt/kubectl-explain/bin/kubectl \
    && apk del curl \
    && rm -rf /var/cache/apk/*
ENV PATH /opt/kubectl-explain/bin:$PATH

ENTRYPOINT ["kubectl-explain"]
