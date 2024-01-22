type PageInfo = {
  title: string;
};

type Page = 'home' | 'about' | 'contact';

// Record는 위 두 타입을 묶을 수 있다.
// Record<key, value> : key는 string, value는 PageInfo
const nav: Record<Page, PageInfo> = {
  home: { title: 'Home' },
  about: { title: 'About' },
  contact: { title: 'Contact' }
};

type Product = 'cat' | 'dog';
type NewProudct = Capitalize<Product>; // 'Cat' | 'Dog'
