## 객체지향 프로그래밍(OOP) 개념 이해하기

### 명령형, 절차적 프로그래밍

- 하나의 어플리케이션을 만들 때 그 데이터와 함수를 기준으로 프로젝트를 구성하는 것을 의미함
- 함수가 연관된 함수를 실행시키고, 전역 변수에 접근하여 데이터를 변경할 수 있음
- 단점
  - 여러 함수가 전역적으로 사용되므로, 전체 어플리케이션의 이해도가 필요하며, 예상치 못한 사이드 이펙트가 발생할 가능성이 있음
  - 유지보수 어려움, 확장 어려움

### 객체 지향 프로그래밍(Object-Oriented Programming)

- 객체를 지향하는 컨셉으로 프로그래밍 해나가는 방식
- 객체 지향에 대한 컨셉, 관례에 대해 알아보고 실제 적용해보자
- 프로그램을 객체로 정의하여 객체로 서로 의사소통하도록 설계 및 구성하는 방법을 의미함
- 서로 관련있는 데이터와 함수를 여러 객체로 정의해서 프로그래밍
- 문제 발생 시 관련 객체만 이해하고 수정하면 됨
- 여러번 반복되는 기능은 객체를 그대로 재사용할 수 있음
- 새로운 기능이 필요 시 새로운 객체를 생성해서 확장성이 높아진다.

### Object

- 데이터와 함수로 구성
  - 데이터: fields, property로 통칭
  - 함수: methods로 통칭
  - 만약 MediaPlayer 객체라면?
    - data: music
    - function: play, stop..
- 우리 주변에서 볼 수 있는 다양한 개체들을 선정해서 디자인할 수 있음
  - Error, Exception, Event 도 모두 객체로 정의가능
- class
  - template
    - 데이터 정의가 되지 않음. 정의/묘사만 함
  - declare once
  - no data in
- object
  - instance of a class
    - 클래스에 데이터를 넣은 인스턴스
    - 붕어빵 클래스를 이용해 팥 붕어빵 인스턴스를 생성함
  - created many times
  - data in
- 예시
  - class student
    - name: string, score: number, study().. 등 정의
  - object 생성
    - student Vicky instance 생성
    - student Wonny instance 생성
