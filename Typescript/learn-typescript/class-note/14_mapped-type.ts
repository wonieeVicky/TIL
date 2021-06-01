type Wonnies = "Vicky" | "Wonny" | "Fongfing";
type WonnyAges = { [K in Wonnies]: number }; // Vikcy: number, Wonny: number, Fongfing: number

const ages: WonnyAges = {
  Vicky: 32, // if "32" : error occured!
  Wonny: 31,
  Fongfing: 32,
};

// for in 반복문 코드
/* var arr = ["a", "b", "c"];
for (var key in arr) {
  console.log(arr[key]); // a, b, c
} */
