interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// 상품 목록을 받아오기 위한 API 함수
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
type ShoppingItem = Pick<Product, "id" | "name" | "price">;

// 상품의 상세정보 조회
function displayProductDetail(shoppingItem: ShoppingItem) {}
