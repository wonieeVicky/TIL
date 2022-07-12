## 통계 사이트 최적화

### 실습 내용 & 분석 툴 소개

이번 강의에서는 애니메이션 최적화(Reflow, Repaint), 컴포넌트 Lazy Loading(code splittin), 컴포넌트 Preloading, 이미지 Preloading 등을 알아보고자 한다. 여기에서 애니메이션 최적화는 렌더링 성능을 최적화하며, 나머지 3가지는 로딩 성능 최적화를 돕는다.

이번 시간 분석 툴도 network, performance, webpack-bundle-analyzer을 이용해보고자 한다.

### 서비스 탐색 & 코드 분석

해당 프로젝트는 리우 올림픽과 런던 올림픽의 통계 데이터를 비교하는 사이트이다.
프로젝트는 적절히 clone 받았다면 코드 분석을 진행해본다.

`src/App.js`

```jsx
<div className="App">
  <Header />
  <InfoTable />
  <ButtonModal
    onClick={() => {
      setShowModal(true);
    }}
  >
    올림픽 사진 보기
  </ButtonModal>
  <SurveyChart />
  <Footer />
  {showModal ? (
    <ImageModal
      closeModal={() => {
        setShowModal(false);
      }}
    />
  ) : null}
</div>
```

위와 같은 구조로 메뉴가 구성되어 있다.
