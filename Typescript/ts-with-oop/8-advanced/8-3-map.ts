{
  // 기존의 타입을 이용하면서 다른 형태로 타입을 변환할 수 있음
  type Video = {
    title: string;
    author: string;
    description: string;
  };

  // type Optional<T> = {
  //   // 괄호 안에 넣으면 map과 같은 역할을 함 - key를 순회할 수 있음
  //   // P in keyof T: T가 가진 Key들을 순회하면서 타입을 정의
  //   [P in keyof T]?: T[P]; // for...in
  // };

  // type ReadOnly<T> = {
  //   readonly [P in keyof T]: T[P];
  // };

  // type VideoOptional = Optional<Video>;

  // const videoOp: VideoOptional = {
  //   title: 'vicky video'
  // };

  // type Animal = {
  //   name: string;
  //   age: number;
  // };
  // const animal: Optional<Animal> = {
  //   name: 'dog'
  // };
  // animal.name = 'cat';

  // type VideoReadOnly = ReadOnly<Video>;

  // const video: VideoReadOnly = {
  //   title: 'hi',
  //   author: 'vicky',
  //   description: 'hello'
  // };
  // video.title = 'bye'; // error

  // type VideoOptional = {
  //   title?: string;
  //   author?: string;
  //   description?: string;
  // };

  // type VideoReadOnly = {
  //   readonly title: string;
  //   readonly author: string;
  //   readonly description: string;
  // };

  type Nullable<T> = { [P in keyof T]: T[P] | null };
  const obj2: Nullable<Video> = {
    title: null,
    author: null,
    description: 'string'
  };

  type Proxy<T> = {
    get(): T;
    set(value: T): void;
  };
  type Proxify<T> = { [P in keyof T]: Proxy<T[P]> };
  type ProxyWrapperFn = <T>(value: T) => Proxy<T>;

  const wrappedProxy: ProxyWrapperFn = (value) => {
    let _value = value;
    return {
      get() {
        return _value;
      },
      set(value) {
        _value = value;
      }
    };
  };

  const videoProxy: Proxify<Video> = {
    title: wrappedProxy('영상제목'),
    author: wrappedProxy('작성자'),
    description: wrappedProxy('설명')
  };

  videoProxy.title.get(); // 영상제목
  videoProxy.title.set('new title');
  videoProxy.title.get(); // new title
  videoProxy.description.set('new description');
  videoProxy.description.get(); // new description
}
