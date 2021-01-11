# 프론트엔드 개발과 TDD

## 1. 동기부여

### 아리송한 상황

-   클라이언트 측 자바스크립트를 다루는 것은 복잡함
    -   서버쪽은 노드JS 버전을 마음대로 변경할 수 있다
    -   클라이언트 쪽은 사용자가가 사용할 브라우져 버전을 강제할 수 없다
-   자바스크립트 언어 자체의 특징
    -   console.log 함수가 매우 쉽게 덮어 쓰여질 수 있다
    -   이것은 의도된 언어 스펙이지만 개발자들이 실수할 가능성이 높다
-   타입
    -   '1' + 1 = '11'
    -   '2' \* 3 = 6
    -   1 + '2' + 3 \* 4 = '1212'
-   이러한 문제를 극복하는 방법으로 테스트주도개발(TDD)을 알아보자

## 2. 준비

### 자스민 프레임웍

-   자스민은 피보탈 랩스에서 만든 BDD(Behavior Driven Development) 프레임웍크로서 자동화된 단위 테스트 도구
-   단위 테스트(unit test)란 코드의 기능 단위(funtionality unit)를 테스트 하는 것을 말한다
    -   무엇이 기능인가? 결정하기 쉽지 않음
    -   TDD를 다른 관점에서 바라본 BDD라는 해결책을 제시
-   BDD

    -   유저 스토리 개념을 끌어들인 테스트 작성법
    -   예를 들어 어떤 버튼을 클릭하면 경고 창을 띄우는 유저 스토리를 생각해 보자
        -   Given: 초기 상황
        -   When: 어떤 이벤트가 발생
        -   Then: 후속 결과를 기대
    -   ```js
        describe("어떤 버튼은", () => {
            describe("클릭했을 때", () => {
                it("경고창을 띄운다", () => {});
            });
        });
        ```

    -   테스트 단위를 스팩(spec)이라고 함
        -   자스민에서는 it 함수로 만든다

### 설치

-   [getting_started](https://jasmine.github.io/pages/getting_started.html)
-   두 가지 설치 방법: 스탠드어론, 노드JS
    -   스탠드어론으로 설치 하겠음
-   러너
    -   자스민 코드와 소스 파일, 스펙을 파일을 참조하는 html 파일
    -   setting/index.html 파일 확인
-   헬로월드
    -   `checkout`

## 3. 프론트엔드 코드 테스트

### 테스트할 수 없는 코드

-   프론트엔드 코드 테스트는 비교적 어렵다. 테스트할 수 없게 작성했기 때문

```html
<button onclick="counter++; countDisplay()">증가</button>
<span id="counter-display">0</span>

<script>
    var counter = 0;

    function countDisplay() {
        document.getElementById("counter-display").innerHTML = counter;
    }
</script>
```

-   이 코드의 문제는

    -   관심사가 분리되지 않았음
        -   클릭 이벤트 처리기를 인라인 형태로 정의한 점
    -   재사용성이 떨어짐
        -   counter로 전역 공간을 어지럽힌 점
        -   횟수를 표시하는 span id를 displayCout 함수에서 하드코딩한 점

-   어떻게 하면 테스트할 수 있게 코딩할 수 있을까?
    -   UI에서 완전히 떼어놓고 코드를 모듈화 시키면 비즈니스 로직만 테스트할 수 있음
    -   자바스크립트를 별도로 빼내면 다른 곳에서도 재사용할수 있고 테스트성도 좋아짐
    -   카운터 예제로 프론트엔트 코드 테스트를 알아보겠다

### 모듈 패턴

-   **모듈 패턴**이란

    함수로 데이터를 감추고, 모듈 API를 담고 있는 객체를 반환하는 형태
    (자바스크립트에서 가장 많이 사용되는 패턴, 임의모듈 패턴과 즉시실행함수(IIFE)모듈 패턴 등 )

    1. 임의 모듈 패턴 ✅

        ```jsx
        // 이름 공간으로 활용한다.
        var App = App || {};

        // 이름 공간에 함수를 추가한다. 의존성있는 God 함수를 주입한다.
        App.Person = function(God){
        	var name = God.makeName();

        	// API를 노출한다.
        	Return {
        		getName: function(){ return name },
        		setName: function(newName){ name = newName }
        	}
        }

        // 이렇게 사용한다.
        const person = App.Person(God);
        person.getName();
        ```

    2. 즉시 실행 함수(IIFE) 모듈 패턴 (싱글톤 인스턴스가 됨)

        ```jsx
        var App = App || {};
        App.Person = (function () {
            let name = "";

            return {
                getName(God) {
                    name = name || God.makeName();
                    return name;
                },
                setName(newName) {
                    name = newName;
                },
            };
        })(); // 함수 선언 즉시 실행한다. 싱글톤이다. 단 하나의 객체만 필요할 경우 싱글톤 패턴을 주로 사용한다.

        // 이렇게 사용한다.
        App.Person.getName(God);
        ```

-   모듈 생성 원칙
    -   **단일 책임 원칙**에 따라 모듈은 한 가지 역할만 수행한다.
        그 역할만 집중함으로서 모듈을 더욱 튼튼하게 만든다. 테스트하기도 쉽다.
    -   모듈 자신이 사용할 객체가 있다면 **의존성 주입** 형태로 제공한다.
        또는 팩토리 주입 형태로 제공한다. 테스트하기도 쉽다.

### 카운터 모듈

-   카운터에는 데이터가 있다. 이것을 다루는 ClickCounter 모듈을 먼저 만들자
    -   전역 공간에 있는 counter를 ClickCounter 모듈에 캡슐화하여 관리하겠다
-   스펙은 다음과 같다
    -   ClickCounter 모듈의
        -   getCounter() 는
            -   카운터 값을 반환한다
        -   increase() 는
            -   카운터를 1 올린다
        -   decrease() 는
            -   카운터를 1 내린다
