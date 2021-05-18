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
type ShoppingItem = Pick<Product, "id" | "name" | "price">;
function displayProductDetail(shoppingItem: ShoppingItem) {}

// Partial은 Product 타입을 만족하는 모든 부분집합(조건) - 다 넣어도되고, 몇 가지 빼도 되고 등등 재활용 가능
type UpdateProduct = Partial<Product>;
// 3. 특정 상품 정보를 업데이트(갱신)하는 함수 - 필요 정보만 업데이트할 때 매개변수 타이핑 어떻게?
function updateProductItem(productItem: Partial<Product>) {}
