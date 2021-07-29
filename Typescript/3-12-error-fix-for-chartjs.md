# 차트 관련 타입 오류 해결 및 tree-shaking을 위한 enum 타입 개선

### app.ts의 나머지 에러 정리

```tsx
function createSpinnerElement(id: string) {
  // ..
}

function setChartData(data: CountrySummaryResponse) {
  const chartData = data.slice(-14)
	    .map((value: CountrySummaryInfo) => value.Cases);
  const chartLabel = data
    .slice(-14)
    .map((value: CountrySummaryInfo) =>
      new Date(value.Date).toLocaleDateString().slice(5, -1)
    );
  renderChart(chartData, chartLabel);
}
```

### 차트 관련 타입 오류 해결 및 정리

```tsx
function renderChart(data: number[], labels: string[]) {
  const chartEl = $('#lineChart') as HTMLCanvasElement;
  const ctx = chartEl.getContext('2d');
	// 아래와 같이 직접 타입정의를 바로 해줘도 된다.
  // const ctx = ($('#lineChart') as HTMLCanvasElement).getContext('2d'); 
  Chart.defaults.color = '#f5eaea'; // Chart.js 사용법 변경
  Chart.defaults.font.family = 'Exo 2'; // Chart.js 사용법 변경
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Confirmed for the last two weeks',
          backgroundColor: '#feb72b',
          borderColor: '#feb72b',
          data,
        },
      ],
    },
    options: {},
  });
}
```

### enum 타입을 Union 타입으로 변경

이 부분은 개인적인 공부로 추가한 부분이다!

```tsx
const CovidStatus = {
  Confirmed: 'confirmed',
  Recovered: 'recovered',
  Deaths: 'deaths',
} as const;
type CovidStatus = typeof CovidStatus[keyof typeof CovidStatus];

function fetchCountryInfo(
  countryName: string,
  status: CovidStatus
): Promise<AxiosResponse<CountrySummaryResponse>> {
  // status params: confirmed, recovered, deaths
  const url = `https://api.covid19api.com/country/${countryName}/status/${status}`;
  return axios.get(url);
}
```

기존에 `CovidStatus`를 `src/covid/index.ts` 에서 import하였더니 웹팩 빌드 시 에러가 발생했다. `enum` 타입은 export가 안되나 싶어서 알아보다가 `enum` 타입이 `tree-shaking`이 되지 않는 이슈를 발견..! 

tree-shaking이란?
사용하지 않는 코드를 삭제하는 기능. rollup.js가 transpile 할 때 이 tree-shaking을 통해 export를 했지만 아무데서도 import하지 않는 모듈이나 코드를 삭제하여 번들크기를 줄여준다.

따라서 위 코드를 Union Type으로 바꾸어 처리해주면 tree-shaking 이슈를 개선할 수 있다고 한다. ([참고](https://engineering.linecorp.com/ko/blog/typescript-enum-tree-shaking/))

```tsx
const CovidStatus = {
  Confirmed: 'confirmed',
  Recovered: 'recovered',
  Deaths: 'deaths',
} as const;
type CovidStatus = typeof CovidStatus[keyof typeof CovidStatus];

function fetchCountryInfo(
  countryName: string,
  status: CovidStatus
): Promise<AxiosResponse<CountrySummaryResponse>> {
  // status params: confirmed, recovered, deaths
  const url = `https://api.covid19api.com/country/${countryName}/status/${status}`;
  return axios.get(url);
}
```

위와 같이 Union Type으로 개선해보았다.

이렇게 바꿔주면 `CovidStatus` 타입을 정의한 이점을 그대로 누리면서 `JavaScript`로 transpile 해도 `IIFE`가 생성되지 않으므로 Tree-shaking을 할 수 있다. 

덧, `const enum`을 사용하면 tree-shaking이 되지 않아 Union Type과 같은 이점을 누리지만 실제 변환 시 아래와 같이 각 변수로 변경되므로 긴 문자열을 할당할 경우 Union type과 비교해 다소 불리하다.

```tsx
const enum CovidStatus {
	Confirmed = 'confirmed',
  Recovered = 'recovered',
  Deaths = 'deaths',
}
```

```jsx
const confirmed = 'confirmed';
const recovered = 'recovered';
const deaths = 'deaths';
```