interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// 1. 상품 목록을 받아오기 위한 API 함수
function fetchProducts(): Promise<Product[]> {
  //..
}

// Product와 중복
interface ProductDetail {
  id: number;
  name: string;
  price: number;
}

// Pick 유틸리티 타입을 사용해 기존에 정의된 Product 타입에서 필요한 값만 골라서 사용 가능하다.
// 불필요한 타입 코드들이 줄어들며, 간결하게 타이핑 유지 가능
// 2. 특정 상품의 상세 정보를 나타내기 위한 함수
type ShoppingItem = Pick<Product, 'id' | 'name' | 'price'>;
function displayProductDetail(shoppingItem: ShoppingItem) {}

// Partial은 Product 타입을 만족하는 모든 부분집합(조건) - 다 넣어도되고, 몇 가지 빼도 되고 등등 재활용 가능
type UpdateProduct = Partial<Product>;
// 3. 특정 상품 정보를 업데이트(갱신)하는 함수 - 필요 정보만 업데이트할 때 매개변수 타이핑 어떻게?
function updateProductItem(productItem: Partial<Product>) {}

// 4. 유틸리티 타입 구현하기 - Partial
interface UserProfile {
  username: string;
  email: string;
  profilePhotoUrl: string;
}

// 위 UserProfile의 타입정의를 부분집합으로 처리하려면 아래 같이 처리한다. 단, 중복 코드 발생
interface UserProfileUpdate {
  username?: string;
  email?: string;
  profilePhotoUrl?: string;
}

// #1 타입정의 축약 방식
type UserProfileUpdate = {
  username?: UserProfile['username'];
  email?: UserProfile['email'];
  profilePhotoUrl?: UserProfile['profilePhotoUrl'];
};

// #2 타입정의 축약 방식 - Mapped Type
type UserProfileUpdate = {
  [p in 'username' | 'email' | 'profilePhotoUrl']?: UserProfile[p];
};

// #3 타입정의 축약 방식 - keyof + Mapped Type
type UserProfileUpdate = {
  [p in keyof UserProfile]?: UserProfile[p];
};

// #4 타입정의 축약 방식 - Partial
type Subset<T> = {
  [p in keyof T]?: T[p];
};
