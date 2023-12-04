{
  /**
   * Enum
   */
  // Javascript
  const MAX_NUM = 6;
  const MAX_STUDENTS_PER_CLASS = 10;

  const MONDAY = 0;
  const TUESDAY = 1;
  const WEDNESDAY = 2;

  // enum과 가깝게 아래와 같이 표현할 수 있음
  const DAYS_ENUM = Object.freeze({ MONDAY: 0, TUESDAY: 1, WEDNESDAY: 2 });
  console.log(DAYS_ENUM.MONDAY); // 0
  console.log(DAYS_ENUM.TUESDAY); // 1

  enum Days {
    Monday, // 0
    Tuesday, // 1
    Wednesday, // 2
    Thursday, // 3
    Friday, // 4
    Saturday, // 5
    Sunday // 6
  }
  console.log(Days.Monday); // 0
  console.log(Days.Saturday); // 5

  enum DaysString {
    Monday = 'mon',
    Tuesday = 'tue',
    Wednesday = 'wed',
    Thursday = 'th',
    Friday = 'fri',
    Saturday = 'sat',
    Sunday = 'sun'
  }
  console.log(DaysString.Monday); // mon
  console.log(DaysString.Saturday); // sat

  let day: Days = Days.Saturday;
  day = 2; // ok
  day = 10; // error
  day = 'fri'; // error
  day = Days.Tuesday; // ok. enum으로 선언된 변수에는 enum에 정의된 값만 할당할 수 있음

  // Typescript
  type DaysOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

  let dayOfweek: DaysOfWeek = 'Monday';
  dayOfweek = 'vicky'; // enum으로 선언된 변수에는 enum에 정의된 값만 할당할 수 있음
}
