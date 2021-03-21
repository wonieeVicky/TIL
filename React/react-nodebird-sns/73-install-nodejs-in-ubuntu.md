# 우분투에 노드 설치

### 노드 설치하기

```bash
~/react-next-js-nodebird/prepare/front$ npm i

Command 'npm' not found, but can be installed with:
sudo apt install npm
```

우분투에 npm 패키지를 설치하기 위해 위처럼 sude 코드를 입력하면 에러가 난다. 바로 Node가 깔려있지 않다는 메시지이므로, 먼저 노드부터 install 해준다.

```bash
$ sudo apt-get update
$ sudo apt-get install -y build-essential
$ sudo apt-get install curl // 설치되어있지 않을 때만 설치할 것
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash --
$ sudo apt-get install -y nodejs
```

설치 후 node -v와 npm -v를 눌러 제대로 설치되었는지 확인이 완료되면 `npm i`를 실행시켜 front 서버의 패키지들을 설치해준다.
(back 서버도 위와 마찬가지로 prepare 위치에서 ssh 접근 후 git clone → back 폴더로 이동 후 nodejs 설치 → npm i 를 진행해준다. 추가적으로 back 서버에 mysql을 설치해준다. mysql만을 위한 별도의 서버를 구축하는 것이 바람직하지만, 토이프로젝트이기 때문에 비용적인 면을 생각하여 해당 부분은 back서버에 함께 설치한다.)

그 다음으로는 `npm run build` 으로 프로젝트를 빌드해준다. (만약 프로젝트 사이즈가 커진 상태일 경우 무료 서버의 1G용량을 초과하므로 용량 초과로 인해 build가 안될 수도 있다. 그럴 때에는 메모리 용량을 늘려주어야 한다. 또, 위와 같이 front 서버와 동일한 내용으로 back 서버에 설정을 해줄 때 해당 설정을 모두 터미널에서 수동으로 설치해주는 것이 번거로우므로 명령어를 모아 동일한 서버를 만들어주는 도커를 사용해보는 것도 좋다.)

그런데 front 코드를 빌드해주려고 하니 에러가 발생한다.

```bash
Error occurred prerendering page "/about". Read more: https://err.sh/next.js/prerender-error
TypeError: Cannot read property 'data' of undefined
    at loadUser (/home/ubuntu/react-next-js-nodebird/prepare/front/.next/server/pages/_app.js:691:27)
    at loadUser.throw (<anonymous>)
```

about 페이지 컴포넌트 내에 getStaticProps 메서드 때문인데, 현재 db에서 가져올 데이터가 따로 설정되어있지 않으므로 에러가 발생한다. 따라서 해당 영역을 getServerSideProps로 변경한 뒤 로컬 터미널에서 `git commit -am "change about.js"` → `git push origin master` 로 git에 변경사항을 업로드 해준다.

다시 우분투 front 서버에서 `git pull`을 누르면 변경사항이 front 서버에 반영된다. 이후 재 빌드를 해주면 문제없이 빌드되는 것을 확인할 수 있다.
