## Python 개발 환경 세팅

### 1. Anaconda 설치

Anaconda for Mac으로 [macOS installer](https://www.anaconda.com/downloads#macos) 다운로드 및 설치
터미널로 확인했을 때 정상적으로 노출된다.

```bash
(base) uneedcomms@MacBook-Pro-3 ~ % conda
usage: conda [-h] [-V] command ...

conda is a tool for managing and deploying applications, environments and packages.

Options: ...
```

### 2. jupyter 실행하기

cmd에서 파이썬을 실행하는 것이 UI적으로 좋지 않으므로 좀 더 편하게 사용할 수 있는 jupyter를 실행하여 python 코드를 공부해본다. jupyter는 아래와 같은 방법으로 실행한다.

```bash
$ cd playground
$ jupyter-lab

NumExpr defaulting to 8 threads.
[I 2022-11-24 23:22:20.297 ServerApp] jupyterlab | extension was successfully linked.
[I 2022-11-24 23:22:20.312 ServerApp] Writing Jupyter server cookie secret to /Users/uneedcomms/Library/Jupyter/runtime/jupyter_cookie_secret
[I 2022-11-24 23:22:20.538 ServerApp] nbclassic | extension was successfully linked.
[I 2022-11-24 23:22:20.538 ServerApp] panel.io.jupyter_server_extension | extension was successfully linked.
[I 2022-11-24 23:22:20.635 ServerApp] nbclassic | extension was successfully loaded.
[I 2022-11-24 23:22:20.636 LabApp] JupyterLab extension loaded from /Users/uneedcomms/opt/anaconda3/lib/python3.9/site-packages/jupyterlab
[I 2022-11-24 23:22:20.636 LabApp] JupyterLab application directory is /Users/uneedcomms/opt/anaconda3/share/jupyter/lab
[I 2022-11-24 23:22:20.639 ServerApp] jupyterlab | extension was successfully loaded.
[I 2022-11-24 23:22:20.641 ServerApp] panel.io.jupyter_server_extension | extension was successfully loaded.
[I 2022-11-24 23:22:20.642 ServerApp] Serving notebooks from local directory: /Users/uneedcomms/study/TIL/Python/playground
[I 2022-11-24 23:22:20.643 ServerApp] Jupyter Server 1.18.1 is running at:
[I 2022-11-24 23:22:20.643 ServerApp] http://localhost:8888/lab?token=bfea20b7c109a0a1903dafd250617eb24b913456c6d1b989
[I 2022-11-24 23:22:20.643 ServerApp]  or http://127.0.0.1:8888/lab?token=bfea20b7c109a0a1903dafd250617eb24b913456c6d1b989
[I 2022-11-24 23:22:20.643 ServerApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 2022-11-24 23:22:20.646 ServerApp]

    To access the server, open this file in a browser:
        file:///Users/uneedcomms/Library/Jupyter/runtime/jpserver-25590-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/lab?token=bfea20b7c109a0a1903dafd250617eb24b913456c6d1b989
     or http://127.0.0.1:8888/lab?token=bfea20b7c109a0a1903dafd250617eb24b913456c6d1b989
[I 2022-11-24 23:22:26.132 LabApp] Build is up to date
```

위처럼 처리되면 `http://localhost:8888/lab` 에 Jupyterlab이라는 python 실행이 가능한 ui를 확인할 수 있음 . 실제 핵심로직은 커널에 존재하고 ui를 dev server로 보여준다고 생각하면 된다.

![](../img/221124-1.png)

실제 파일을 새롭게 생성하면 jupyterlab을 실행한 playground 위치에 파일이 생성된다.
