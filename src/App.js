import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import dayjs from 'dayjs';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const calculateAge = (birthdate) => {
    const today = dayjs();
    const birth = dayjs(birthdate);
    return today.diff(birth, 'year');
  };

  const columns = [
    {
      name: 'Last Name',
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: 'Course',
      selector: (row) => row.course,
      sortable: true,
    },
    {
      name: 'Birthdate',
      selector: (row) => row.birthdate,
      sortable: true,
    },
    {
      name: 'Age',
      selector: (row) => calculateAge(row.birthdate),
      sortable: true,
    },
  ];

  const data = useMemo(() => [
    {
      id: 1,
      lastName: 'Williams',
      firstName: 'Alice',
      course: 'IT',
      birthdate: '2000/01/15',
    },
    {
      id: 2,
      lastName: 'Johnson',
      firstName: 'Ethan',
      course: 'CS',
      birthdate: '1998/05/22',
    },
    {
      id: 3,
      lastName: 'Brown',
      firstName: 'Emily',
      course: 'IS',
      birthdate: '2001/11/30',
    },
    {
      id: 4,
      lastName: 'Davis',
      firstName: 'Michael',
      course: 'DS',
      birthdate: '1999/03/15',
    },
  ], []);

  const [records, setRecords] = useState(data);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setRecords(data);
  }, [data]);

  function handleFilter(event) {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const newData = data.filter((row) => {
      const matchesName =
        row.lastName.toLowerCase().includes(searchValue) ||
        row.firstName.toLowerCase().includes(searchValue);
      const matchesCourse = row.course.toLowerCase() === searchValue;
      const matchesAge = calculateAge(row.birthdate).toString().includes(searchValue);

      return matchesName || matchesCourse || matchesAge;
    });

    setRecords(newData);
  }

  function handleDateFilter() {
    const newData = data.filter((row) => {
      const birthDate = dayjs(row.birthdate);
      const min = minDate ? dayjs(minDate) : null;
      const max = maxDate ? dayjs(maxDate) : null;
      return (
        (!min || birthDate.isAfter(min)) &&
        (!max || birthDate.isBefore(max))
      );
    });
    setRecords(newData);
  }

  return (
    <div className="container mt-5">
      <div className="text-end mb-3">
        <input
          type="text"
          placeholder="Filter by Name, Age, or Course"
          onChange={handleFilter}
          className="form-control mb-2"
          value={searchTerm}
        />

        <div className="d-flex">
          <input
            type="date"
            placeholder="Min Birthdate"
            onChange={(e) => setMinDate(e.target.value)}
            className="form-control me-2"
          />
          <input
            type="date"
            placeholder="Max Birthdate"
            onChange={(e) => setMaxDate(e.target.value)}
            className="form-control me-2"
          />
          <button className="btn btn-primary" onClick={handleDateFilter}>
            Apply Date Filter
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={records}
        selectableRows
        fixedHeader
        pagination
      />
    </div>
  );
}

export default App;

