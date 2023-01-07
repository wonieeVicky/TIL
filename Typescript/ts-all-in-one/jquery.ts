const element = $("p");

// removeClass(className_function?: JQuery.TypeOrArray<string> | ((this: TElement, index: number, className: string) => string)): this;
$("p").removeClass("myClass noClass").addClass("yourClass");
$("p").removeClass((index: number, className: string) => "my Class noClass");

$(["p", "t"]).text("hello");
$(["p", "t"]).text(function () {
  console.log(this);
  return true; // ok
});

const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});
