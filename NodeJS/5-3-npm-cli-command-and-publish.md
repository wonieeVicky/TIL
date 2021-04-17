# npm 명령어 및 npm 배포하기

## 가. npm 명령어([참고](https://docs.npmjs.com/cli/v6/commands))

- `npm outdated`
  - 어떤 패키지에 기능 변화가 생겼는지 알 수 있음, 패키지 업데이트를 체크해준다.
- `npm update`
  - package.json에 따라 업데이트 된다.
- `npm uninstall [패키지명]` (= npm rm [패키지명])
  - 패키지 삭제
- `npm search [검색어]`
  - npm 패키지를 검색할 수 있음(npmjs.com에서도 가능)
- `npm info [패키지명]`
  - 패키지의 세부 정보 파악 가능
- `npm adduser` (= `npm login`)
  - npm에 로그인을 하기 위한 명령어 (npmjs.com에서 회원가입)
- `npm whoami`
  - 현재 사용자가 누군인지 알려줌
- `npm logout`
  - 로그인한 계정을 로그아웃
- `npm version [버전]`
  - package.json의 version을 올림 - 내가 올린 패키지가 있을 경우!
  - npm version patch, npm version minor, npm version major → git commit과 태그까지 붙여줌
- `npm deprecate [패키지명][버전] [메시지]`
  - 패키지를 설치할 때 경고 메시지를 띄우게 함(오류가 잇는 패키지에 적용)
- `npm publish`
  - 자신이 만든 패키지를 배포
- `npm unpublish —force`
  - 자신이 만든 패키지를 배포 중단(배포 후 72시간 내에만 가능)
  - 다른 사람이 내 패키지를 사용하고 있는데 배포가 중단되면 문제가 생기기 때문
- `npm ls [패키지명]`
  - 내 프로젝트가 어떤 패키지를 사용하고 있는지 찾고 싶을 때 npm ls 사용
- [https://docs.npmjs.com](https://docs.npmjs.com) CLI Commands에서 확인

## 나. npm 배포하기

npm 회원가입 후 터미널에서 npm adduser로 로그인 완료!

### npm 배포할 패키지 작성

`test/package.json`

```json
{
  "name": "npmtest-0326",
  "version": "0.0.1",
  "description": "hello package.json",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "vicky",
  "license": "MIT"
}
```

`test/index.js`

```json
module.exports = () => {
  return "hello package";
};
```

### 배포 시도하기

위 파일로 패키지를 만들려면 아래와 같이 명령어 입력

```bash
$ cd test
$ npm publish

npm notice
npm notice 📦  npmtest-0326@0.0.1
npm notice === Tarball Contents ===
npm notice 57B  index.js
npm notice 231B package.json
npm notice === Tarball Details ===
npm notice name:          npmtest-0326
npm notice version:       0.0.1
npm notice package size:  332 B
npm notice unpacked size: 288 B
npm notice shasum:        d8a91fb57db74ea81cd3c2026648097fc0049909
npm notice integrity:     sha512-2hWGKNijX4TIQ[...]lxHxLPA+CUjyw==
npm notice total files:   2
npm notice
+ npmtest-0326@0.0.1
```

### 배포 확인하기

publish 된 내용을 아래와 같이 확인할 수 있다.

```bash
$ npm info npmtest-0326

npmtest-0326@0.0.1 | MIT | deps: none | versions: 1
hello package.json

dist
.tarball: https://registry.npmjs.org/npmtest-0326/-/npmtest-0326-0.0.1.tgz
.shasum: d8a91fb57db74ea81cd3c2026648097fc0049909
.integrity: sha512-2hWGKNijX4TIQ+I10jnZ177HR/7OXTeO7ySfBFKNML0YAePY3DlCXV9mH/DWbBHDEthO5L3tElxHxLPA+CUjyw==
.unpackedSize: 288 B

maintainers:
- vicky_w <hwfongfing@gmail.com>

dist-tags:
latest: 0.0.1

published a minute ago by vicky_w <hwfongfing@gmail.com>
```

### 배포 취소하기

72시간 내 package 배포를 삭제

```bash
$ npm unpublish --force
$ npm info npmtest-0326

npm ERR! code E404
npm ERR! 404 Unpublished by vicky_w on 2021-04-17T14:20:52.576Z
npm ERR! 404
npm ERR! 404  'npmtest-0326' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/uneedcomms/.npm/_logs/2021-04-17T14_20_56_736Z-debug.log
```
