const element = $("p");

// removeClass(className_function?: JQuery.TypeOrArray<string> | ((this: TElement, index: number, className: string) => string)): this;
$("p").removeClass("myClass noClass").addClass("yourClass");
$("p").removeClass((index: number, className: string) => "my Class noClass");

$(["p", "t"]).text("hello");
$(["p", "t"]).text(function () {
  console.log(this);
  return true; // ok
});

const tag2 = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag2).html(function (i: number) {
  console.log(this);
  return $(this).data("name") + "입니다";
});

interface vQuery<T> {
  text(param?: string | number | ((this: T, index: number) => string | number | boolean)): this;
  html(param: string | Document | DocumentFragment): void;
}

const $tag: vQuery<HTMLElement> = $(["p", "t"]) as unknown as vQuery<HTMLElement>;
$tag.text("123");
$tag.text(123);
$tag.text().html(document);
$tag.text(function (index) {
  console.log(this, index);
  return true; // ok
});

const tag = $("ul li").addClass(function (index) {
  return "item-" + index;
});

$(tag).html(document);
