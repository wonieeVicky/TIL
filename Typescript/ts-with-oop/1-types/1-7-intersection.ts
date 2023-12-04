{
  /**
   * Intersection Types: &
   */
  type Student = {
    name: string;
    score: number;
  };

  type Worker = {
    employeeId: number;
    work: () => void;
  };

  // 학생이기도 하면서 일을 함
  function internWork(person: Student & Worker) {
    console.log(person.name, person.employeeId, person.work());
  }

  // 모든 type이 포함되어야 한다.
  internWork({
    name: 'vicky',
    score: 100,
    employeeId: 235,
    work: () => {}
  });
}
