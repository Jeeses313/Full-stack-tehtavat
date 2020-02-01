import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
    </>
  )
}

const AddPersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </>
  )
}

const PersonsList = ({ personsToShow, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <Person key={person.name} person={person} handleDelete={handleDelete}></Person>
      )}
    </>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <div>{person.name} {person.number} <button onClick={() => handleDelete(person)}>delete</button></div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return (
      <></>
    )
  }
  if (message.error) {
    return (
      <div className='errormessage'>{message.message}</div>
    )
  }
  return (
    <div className='message'>{message.message}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      });
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletedObject(person)
        .then(response => {
          const newPersons = persons.filter(listedPerson => listedPerson.name !== person.name);
          setPersons(newPersons);
          setMessage({ message: `Deleted ${person.name}`, error: false });
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        })
        .catch(error => {
          const newPersons = persons.filter(listedPerson => listedPerson.name !== person.name);
          setPersons(newPersons);
        })
    }

  }

  const addPerson = (event) => {
    event.preventDefault();
    let existingPerson = null;
    persons.forEach((person) => {
      if (person.name === newName) {
        existingPerson = person;
      }
    })
    if (existingPerson !== null) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        existingPerson.number = newNumber;
        personService
          .update(existingPerson.id, existingPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : existingPerson))
            setNewName('');
            setNewNumber('');
            setMessage({ message: `Changed ${existingPerson.name}'s number`, error: false });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch(error => {
            setMessage({ message: `Information of ${existingPerson.name} has already been removed from server`, error: true });
            const newPersons = persons.filter(listedPerson => listedPerson.name !== existingPerson.name);
            setPersons(newPersons);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      };
      personService
        .create(newPerson)
        .then(response => {
          newPerson.id = response.data.id;
          setPersons(persons.concat(newPerson));
          setNewName('');
          setNewNumber('');
          setMessage({ message: `Added ${newPerson.name}`, error: false });
          setTimeout(() => {
            setMessage(null)
          }, 5000);
        })
        .catch(error => {
          setMessage({ message: error.response.data.error, error: true });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  }

  const personsToShow = (filter === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}></Notification>
      <Filter filter={filter} handleFilterChange={handleFilterChange} ></Filter>
      <AddPersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}></AddPersonForm>
      <PersonsList personsToShow={personsToShow} handleDelete={handleDelete}></PersonsList>
    </div>
  )

}

export default App
