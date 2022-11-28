## Python 자료형에 대하여

> 💫 **Reference: 점프투 파이썬 : [https://wikidocs.net/book/1](https://wikidocs.net/book/1)**

## 변수

### 간단한 컴퓨터 구조와 램(RAM)

![Alt text](../img/221127-2.png)

- RAM : context(문맥), 프로그램이 돌아가기 위한 저장공간을 의미함, 임시데이터 저장 공간
- Disk : 영구적으로 저장되는 데이터의 저장소
- CPU : 프로그램의 실제 연산을 진행 후 RAM에 저장

### 변수 할당(선언)

```python
a = 1
my_first_number = 1
identity = 'Human'
name = 'Vicky'
```

### 변수 사용

- 변수에 새로운 값을 입력하는 방법은 변수를 선언하는 것과 같다.
- **변수는 왜 사용하는가?** 재활용성(Reusability)

```python
print(1) # 1
print(2) # 2
target = 3
target + 10 - 12 # 1
target - 10 * 10 # -97

name = 'Vicky'
print("Hello I',m",name,"!!") # Hello I'm Vicky !!
```

### 주석

- 프로그래밍 언어가 무시하는 문자로 코드를 설명하거나 코드를 임시로 작동하지 못하게 한다.
- #을 쓰고 그 오른쪽에 주석을 입력
- 여러줄을 주석으로 처리하고 싶을때는 따옴표 """로 그 내용을 둘러싼다.

```python
# 정체와 다리의 수를 출력하는 코드
identity = '사람' # 정체
number_of_legs # 다리의 수

print('안녕!')

# 이 아래 줄은 주석처리 되었기 때문에 실행되지 않는다.
#print('??')

"""
여러줄을
주석처리할 때에는
따옴표 3개로 주석처리해준다.
"""
```

## 자료형

- RAM에 변수를 저장하는 형식
- 컴퓨터가 추후에 변수관련 연산을 할 때 용이하게 해줌
- 클래스(Class)

### 숫자(Integer, float)

- 상세한 데이터 타입을 나눌 필요없이 파이썬이 알아서 정의해준다.

```python
my_age = 31
a = 1
b = 2.3
c = -5
```

- 다른 언어의 경우 숫자 자료형이 float, interger 등으로 상세히 나뉘어져 있음
  - C 언어의 경우
    ```c
    int a = 1
    float b= 3.2
    ```
- 숫자는 아래와 같이 여러가지 연산이 가능하다.

```python
# 더하기
my_next_age = my_age + 1 # 32

# 곱하기
multiply = 9 * 9 # 81

# 나누기
divide = 30 / 5 # 6.0

# 거듭제곱 (2의 10승)
power = 2 ** 10 # 1024

# percent
remainder = 15 % 4 # 3
```

### 리스트(list)

- list가 필요한 이유: 동일한 속성의 데이터를 하나로 묶어 관리하기 위함
  아래와 같이 할당한다.
  ```python # a = 90 # b = 30 # c = 60
  class_score = [90, 30, 60] # 혹은
  class_score = list([90, 30, 60])

      print(class_score) # [90, 30, 60]
      type(class_score) # list

      class_score = [1, 2, [1, 2]]
      ```

- indexing

  - 0부터 시작하는 이유? 변수가 가리키는 list의 첫번째 값을 의미하므로
    - class_score[1]은 변수가 가리키는 list(90이 첫번째 값)에서 1단계 다음에 존재하므로 30
    ```python
    class_score = [90, 30, 60]
    class_score[2] # 60
    class_score[1] # 30
    ```
  - -1 indexing
    ```python
    class_score = [1, 2, 3, 4, 5];
    print(class_score[-1]) # 5
    print(class_score[-1]) # 4
    ```
  - ‘범위’ 인덱싱: 값을 여러 개 가져오고 싶을 때

    ```python
    class_score = [1, 2, 3, 4, 5];
    class_score[0:1] # [1] - 첫 번째 인수는 포함, 두 번째 인수는 미포함
    class_score[0:2] # [1, 2]
    class_score[:1] # [1]
    class_score[1:] # [2, 3, 4, 5]
    class_score[:] # [1, 2, 3, 4, 5]
    class_score[-2:] # [4, 5]

    type(class_score[1]) # int
    type(class_score[0:2]) # list
    ```

- 다차원 리스트

  ```python
  # 2차원 리스트
  중고차 = ["K5", "white", [5000, 6000]]
  print(중고차[2][1]) # 6000

  # 3차원 리스트 - 행렬
  [
  	[1, 2, 4],
  	[1, 2, 3],
  	[1, 3, 2]
  ]
  ```
