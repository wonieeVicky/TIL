# 유틸리티 타입 구현(Partial)

Utility 타입 중 Partial 타입을 실제 구현해보면 어떨까? 아래의 과정을 따라가보자.

```tsx
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
```

위 UserProfile의 타입정의를 상속받는 UserProfileUpdate 인터페이스 타입이 있다고 했을 때 이 인터페이스는 동일하게 username, email, profilePhotoUrl이 있지만 해당 값이 있을 수도 있고 없을 수 도 있으므로 물음표`?`를 붙여서 처리해준다.

하지만 불필요한 타입들이 중복 정의되고 있으므로 이는 좋은 방법이 아니다. 어떻게 줄여나갈 수 있을까?

### 방법 1

아래처럼 타입별칭을 활용하여 UserProfile['key'] 형태로 접근이 가능하다.
하지만 이 또한 중복코드가 발생하고 있음, 어떻게 더 줄여나갈 수 있을까?

```tsx
type UserProfileUpdate = {
  username?: UserProfile['username'];
  email?: UserProfile['email'];
  profilePhotoUrl?: UserProfile['profilePhotoUrl'];
};
```

### 방법2

타입정의 축약 방식에 Mapped Type을 활용할 수 있다.

Mapped Type은 하위에 적어놓은 username, email, profilePhotoUrl 값을 Map처럼 순회하면서 해당 값을 담는 루프형태의 타입정의 방식이다. (p를 UserProfile에 대입)

이 또한 좋은 방법이지만, 타입스크립트의 keyof 메서드를 사용하면 더 간결히 줄일 수 있음

```tsx
type UserProfileUpdate = {
  [p in 'username' | 'email' | 'profilePhotoUrl']?: UserProfile[p];
};
type UserProfileKeys = keyof UserProfile;
```

### 방법3

keyof UserProfile은 "UserProfile의 키값을 순회한다"는 의미로 방법2 보다 조금 더 줄여서 사용이 가능하다.

여기까지도 충분하지만 만약 해당 타입정의를 다른 타이핑 시에도 유틸함수처럼 사용하고 싶다면 어떻게 하면좋을까? 바로 UserProfile 영역이 동적으로 주입될 수 있도록 제네릭으로 처리하면 된다.

```tsx
type UserProfileUpdate = {
  [p in keyof UserProfile]?: UserProfile[p];
};
```

### 방법4

keyof + Mapped Type + Generic으로 구현한 Subset 타입구조는 여러 타입에서도 유틸리티 타입처럼 사용할 수 있다. (예를 들어 `Subset<UserProfile>`처럼) 이 구조는 실제 Partial의 타입정의와 동일한 구조이다.

```tsx
type Subset<T> = {
  [p in keyof T]?: T[p];
};
```

실제 Partial 구조를 살펴보면 아래와 같음. 변수명만 다를 뿐 구조가 같다 :)

```tsx
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

keyof 나 Mapped Type이 처음에는 어렵게 느껴질 수 있지만 하나씩 정의를 타고올라가면서 확인하면 쉽게 이해할 수 있다..!
