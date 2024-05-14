## 1. 워크벤치

### 1.1 워크 벤치 시작

![Screenshot 2024-05-13 at 5.27.59 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/b36859b2-e82c-4c55-b5c7-077683e64a42/Screenshot_2024-05-13_at_5.27.59_AM.png)

connection name: test로 일단 세팅

connection method: TCP/IP

Hostname: 127.0.0.1 or localhhost

### 1.2 워크 벤치 구조

![Screenshot 2024-05-13 at 5.42.04 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/7ada45b6-6e0d-4da1-9f86-7623530bb19a/Screenshot_2024-05-13_at_5.42.04_AM.png)

1. 가운데 상단에 쿼리 작성
2. 가운데 중간에 쿼리 결과값
3. 쿼리 결과값의 그리드에서 직접적으로 코드 업데이트 가능
4. SELECT시에, 어떤 스키마에서 택하는지 정하기 위해서 왼쪽 상단 스키마들 중에 원하는 스키마 더블 클릭(서택되면 볼드체로 변함)
5. 세팅에서 폰트 크기 등 여러 설정 가능

### 1.3 스키마 생성

스키마에서 오른쪽 마우스 클릭하고 create schemas

![Screenshot 2024-05-13 at 5.49.59 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/978c378e-9a5b-4c96-9258-878f91ca56af/Screenshot_2024-05-13_at_5.49.59_AM.png)

스키마 이름 정하고 apply 클릭

![Screenshot 2024-05-13 at 5.50.05 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/f04b6e7f-c692-445d-a7b5-b85d86510512/Screenshot_2024-05-13_at_5.50.05_AM.png)

쿼리문 확인 후 apply 하면 생성 완료

## 2. 유튜브 유저 테이블 생성

<aside>
🗒️ 채널(분리)

</aside>

| 채널 번호(PK) | 채널명 | 구독자 수 | 영상 수 | user_id(FK) |
| --- | --- | --- | --- | --- |
| 1 | 스탠리 | 1 | 5 | 1 |
| 2 | 스타벅스 | 20 | 50 | 2 |
| 3 | 다이소 | 50 | 200 | 3 |
| 4 | 애플 | 1000 | 600 | 2 |
| 5 | 아마존 | 10000 | 900 | 4 |

<aside>
🗒️ 사용자(분리)

</aside>

| id(PK) | 채널주인 | 비밀번호 | 연락처 | 이메일 |
| --- | --- | --- | --- | --- |
| GA | 가가가 | 1111 | 010-1249-4999 | ga@gmail.com |
| NA | 나나나 | 2222 | 010-9149-4999 | na@gmail.com |
| DA | 다다다 | 3333 | 010-6549-4999 | da@gmail.com |
| MA | 마마마 | 5555 | 010-3449-4999 | ma@gmail.com |

### 2.1 create table

> 테이블 생성
> 

왼쪽 스키마 바에서 오른쪽 클릭 후 CREATE TABLE 선택

선택하면 다음과 같은 창이 나옴

![Screenshot 2024-05-14 at 3.41.14 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/f352aa75-4958-4672-8d27-400b52cf8dea/Screenshot_2024-05-14_at_3.41.14_PM.png)

상단에 테이블 명 기입

중간에 칼럼의 이름, 데이터 타입, 여러 조건 등을 걸 수 있음

### 2.2 rename table

테이블 명을 변경하고 싶다면, 쿼리문을 작성해주면 된다.

```sql
RENAME TABLE `기존 테이블명` TO `새로운 테이블명`
```

중요한 건 테이블명에 백틱(**`**)을 사용해야 한다는 것이다.

![Screenshot 2024-05-14 at 3.38.56 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/5e351a12-27e1-43ac-8eac-c1cf0da17678/Screenshot_2024-05-14_at_3.38.56_PM.png)

난 users라는 테이블명을 실수로 new_table로 생성해서, 변경해보았다.

![Screenshot 2024-05-14 at 3.39.05 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/90a73792-1df1-4368-abb4-2ac9df0c4a6e/Screenshot_2024-05-14_at_3.39.05_PM.png)

![Screenshot 2024-05-14 at 3.39.01 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/fbe03cea-a4e2-4d0a-bc9c-26d6f5bdeed6/Screenshot_2024-05-14_at_3.39.01_PM.png)

### 2.3 데이터 타입

id라는 컬럼을 생성하면, 자동으로 PK라는 걸 인식하고 조건을 정해준다. 

![Screenshot 2024-05-14 at 3.42.28 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/1cd7877a-58f6-44c9-8ac5-94e8b802b791/Screenshot_2024-05-14_at_3.42.28_PM.png)

자주 쓰이는 데이터 타입은 INT, BIGINT, VARCHAR, CHAR, DATETIME, DOUBLE 등이 있다.

> INT vs BIGINT
> 

INT는 4바이트이고 BIGINT는 8바이트이다.

*4바이트는 -2147483648 ~ 2147483647*의 범위를 가진다.

INT 타입은 보통 음수를 제외하고 양수를 허용하기에 *0 ~ 4294967295*의 범위(Unsigned value)를 가진다고 볼 수 있다. 즉 대략 42억이라는 범위의 데이터를 담을 수 있어서 보통 INT를 사용한다.

> VARCHAR vs CHAR
> 

둘 다 문자열이며, 뒤에 괄호에 넣는 숫자를 통해서 그 크기를 지정할 수 있다.

VARCHAR(30)이면, 30글자의 문자열을 받는다는 것

VARCHAR은 var에서도 알 수 있듯이 가변성을 가진다.

만약 VARCHAR(30)에 5글자인 ‘12345’가 들어오면, ‘12345’ 이렇게 입력이 된다.

반대로 불변성을 지닌 CHAR 자료형의 경우에는 CHAR(30)에 ‘12345’가 들어오면 비록 입력된 문자열의 크기가 5라도 입려되는 값 자체는 30만큼의 글자수를 지녀야 한다. 따라서, 최종 입력되는 문자열은 ‘12345                         ‘이 될 것이다.

### 2.4 PK, NN, UQ, B, UN, ZF, AI, G, Default /expression

> PK
> 

primary key, 중복이나 빈값이 들어올 수 없음

> NN
> 

Not Null

빈 값이 못 들어옴

> UQ
> 

Unique

중복 값 못 들어옴

> UN
> 

Unsigned data type

음수 데이터값 삭제

> B
> 

데이터를 이진 문자열로 저장

> ZF
> 

Zero filled 

INT(10) 이런 식으로, INT의 자릿수가 정해져있다면, 괄호 안의 수보다 작을 때 자릿수를 다 0으로 채우고 난 후에 입력된 값을 배치시킨다.

예를 들어서, INT(5) ZEROFILL이라는 특성을 가진 칼럼에 ‘123’을 넣는다면, 최종 입력값은 ‘00123’이 되는 것이다.

> AI
> 

Insert 시마다 1씩 늘어남

주로 id의 특성으로 쓰이는 듯하다.

> G
> 

다른 열을 기반으로 한 수식으로 생성된 값

> Default/expression
> 

Default - 기본값

Expression - 기본값에 대한 수식 설정

## 3. DB 연동

> npm mysql2
> 

[npm: mysql2](https://www.npmjs.com/package/mysql2)

### 3.1 first query

> mysql2의 first query
> 

```sql
// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
});

// A simple SELECT query
connection.query(
  'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

// Using placeholders
connection.query(
  'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
  ['Page', 45],
  function (err, results) {
    console.log(results);
  }
);
```

### 3.2 DB에 맞게 세팅

1. Create the connection to database

```sql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Youtube',
});
```

1 - 패스워드 추가

2 - 기존 test 세팅값에서 db의 Youtube 데이터베이스로 변경

> A simple SELECT query
> 

```sql
connection.query(
  'SELECT * FROM `users`',
  function (err, results, fields) {
    const {id,email,name,password,contact, created_at} = results[0] //1 

    console.log(id)
    console.log(email)
    console.log(name)
    console.log(password)
    console.log(contact)
    console.log(created_at)

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);
```

1 - 분할 구조 할당으로 results 배열의 데이터를 꺼내줌

### 3.3 created_at 컬럼 추가 및 time_zone → 서울시간대로 변경

> created_at 추가
> 

![Screenshot 2024-05-14 at 4.46.27 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/994f1771-265b-4037-9882-e68a7bf3e444/Screenshot_2024-05-14_at_4.46.27_PM.png)

users의 두번째 버튼 클릭 후 created_at 컬럼 추가하기

![Screenshot 2024-05-14 at 4.45.35 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/6819005e-80c9-4113-b506-a185fbbb674d/Screenshot_2024-05-14_at_4.45.35_PM.png)

데이터타입은 TIMESTAMP

디폴트값은 CURRENT_TIMESTAMP()

> time_zone 변경
> 

기본 시스템의 시간대는 UTC로 한국의 시간대와는 다름

![Screenshot 2024-05-14 at 4.48.52 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/300c2cf0-36e6-48ca-9f70-42c2793f9f0f/Screenshot_2024-05-14_at_4.48.52_PM.png)

시간대를 한국으로 변경하기 위해서 

2가지 작업 진행

```sql
SET GLOBAL time_zone = 'Asia/Seoul';
```

글로벌로 작업 → workbench 끄고 다시 실행하면 변경됨

만약, 바로 현재 작업 중인 데이터베이스(세션)의 시간대를 변경하고 싶으면 글로벌 없이 진행

```sql
SET time_zone = 'Asia/Seoul';
```

글로벌 시간대와 작업 세션의 시간대를 보려면 다음의 코드를 통해서 확인 가능

```sql
SELECT @@global.time_zone, @@session.time_zone;
```