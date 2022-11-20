## Basic Python

## 1. Intro

### - print() 함수

- 괄호 안에 있는 내용을 화면에 출력하는 명령

```python
# test.py
print('Hello World')

# run code at Mac OS
python test.py // Hello World

# python만 칠경우 터미널에서 파이썬이 실행된다. 나오려면..
exit()
```

## 2. 변수와 계산

### 1. 변수 사용하기

- 변수의 선언

```python
identity = 'Human'
name = 'Vicky'
```

- 변수의 사용: 변수에 새로운 값을 입력하는 방법은 변수를 선언하는 것과 같다.

```python
name = 'Vicky'
print("Hello I',m",name,"!!") # Hello I'm Vicky !!
```

### 2. 주석

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

### 3. 숫자와 문자열

- 숫자

```python
my_age = 31
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

- 문자열
    - 따옴표로 감싸진 글
    - 텍스트 두 개를 더하면 문자열이 이어붙으며, 텍스트는 더하기만 가능하고 빼기 등의 다른 계산은 불가능하다.

```python
my_name = 'Vicky'
text = '1990'+'0326'

print(my_name, text) #Vicky 19900326

birth_year='1990'
birth_date='0326'
year_and_date = birth_year + birth_date

print("year_and_date : {}".format(year_and_date)) # year_and_date : 19900326
```

### 4. PERL

- Python에는 코드를 실행하는 다른 방법인 Perl이 있다.
    - 터미널에서 `python3` 를 치고 그 안에서 한 줄 단위의 간단한 연산을 구현할 수 있다.
    - Like Chrome console 창과 비슷한 역할을 한다.
    - 종료하려면 `exit()`를 입력하면 된다.
- Read - Eval - Print Loop
    
    Read : (코드를) 읽어서
    
    Eval : (읽은 코드를) 평가(실행)하고
    
    Print : (실행한 결과를) 출력하는
    
    Loop : 루프(반복)
    

### 5. Command Shell(Terminal) 사용법

- Shell이란 운영체제와 사용자가 소통하는 방법이다.
- Python 을 쓸 때에는 Graphic Shell보다는 Command Shell이 편하므로 Command Shell을 쓴다.
- 간단한 명령어
    - `pwd` : 현재 폴더 경로 출력
    - `ls` : 현재 폴더 내용물 출력
    - `cd <폴더명>`: 다른 폴더로 이동
        - `cd..` : 상위 폴더로 이동
    - `cp` : 파일을 다른 이름으로 복사
        - `cp test.py test2.py`
    - `rm` : 파일을 삭제

---

## 3. 조건문

- *잠깐 ! python에 한글 사용 시 터미널에서 `no encoding declared` 에러가 난다면?*
    
    아래의 주석을 문서 최상단에 넣어주면 된다 !
    
    ```python
    # -*- coding: utf-8 -*-
    ```
    
- 조건문은 특정 조건에 따라 다른 동작을 할 수 있도록 해주는 구문이다.
- 단순 반복문
    
    ```python
    for i in range(0, 5):
        print("BMW 있어요")
    
    # BMW 있어요
    # BMW 있어요
    # BMW 있어요
    # BMW 있어요
    # BMW 있어요
    ```
    
- 기본적으로 부등호를 통한 대소비교를 할 수 있다.
    
    ```python
    people = 3
    apple = 20
    
    # 'if'는 if문의 시작
    # if 뒤에는 조건식을 쓴다.
    if people < apple / 5: # 조건식이 끝나면 따옴표(:)를 쓰고
        # <탭> 키를 이용해 들여쓴 뒤
        print('신나는 사과 파티! 배터지게 먹자!') # 실행하고 싶은 코드를 적는다.
    
    if apple % people > 0:
        print('사과 수가 맞지 않아! 몇 개는 쪼개 먹자!')
    
    if people > apple:
        print('사람이 너무 많아! 몇 명은...')
    ```
    
- 또한 True/False로도 if문을 쓸 수 있다.
    
    ```python
    if True:
        print("조건식이 True이므로 실행됩니다.")
    if False:
        print("조건식이 False이므로 실행되지 않습니다.")
    ```
    
- 리스트 포함 여부를 판단하도록 만들 수 있음
    
    ```python
    중고차재고 = ["K5", "BMW", "Tico"]
    
    # if 내가 사려는 K5가 중고차 재고 데이터에 있으면:
    if "K5" in 중고차재고:
        print("지금 주문 가능합니다.")
    else:  
        print("중고 불가능함 ㅅㄱ")
    ```
    
- List에서 자료를 하나씩 뽑아쓰는 반복문으로 만들 수 있다.
    
    ```python
    중고차들 = ["K5", "BMW", "Tico"]
    
    for i in 중고차들:
        print(i)
    
    # K5
    # BMW
    # Tico
    
    for i in 중고차들:
        print(i * 3)
    
    # K5K5K5
    # BMWBMWBMW
    # TicoTicoTico
    ```
    

## 4. 리스트, 딕셔너리 자료

### 1. 리스트

```python
중고차 = ["K5", "white", [5000, 6000]]

print(중고차[2][1]) # 6000
```

### 2. 딕셔너리 자료형

- 리스트 자료형과 다르게 이름을 붙여 저장한다

```python
중고차2 = {"brand": "BMW", "model": "k5"}
중고차2["brand"] = "Hyundai"

print(중고차2["brand"]); # Hyundai
```
