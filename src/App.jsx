import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [list, setList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // Track the index of the item with the open menu

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:9000/todos');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addItem = async () => {
    if (userInput) {
      const newItem = { value: userInput, checked: false };
      try {
        const response = await axios.post('http://localhost:9000/todos', newItem);
        setList([...list, response.data]);
        setUserInput('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/todos/${id}`);
      setList(list.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editItem = async (index) => {
    const newValue = prompt('Edit the todo:');
    if (newValue) {
      const updatedItem = { ...list[index], value: newValue };
      try {
        const response = await axios.patch(`http://localhost:9000/todos/${updatedItem._id}`, updatedItem);
        const updatedList = [...list];//copying This ensures that you are not mutating the original list state directly
        updatedList[index] = response.data;
        setList(updatedList);
      } catch (error) {
        console.error('Error editing todo:', error);
      }
    }
  };

  const toggleCheck = async (index) => {
    const updatedItem = { ...list[index], checked: !list[index].checked };
    try {
      const response = await axios.patch(`http://localhost:9000/todos/${updatedItem._id}`, updatedItem);
      const updatedList = [...list];
      updatedList[index] = response.data;
      setList(updatedList);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleMenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    //If they are equal (activeIndex === index), it means the menu or item is currently active, so setting the state to null will deactivate it (i.e., close the menu).
	// If they are not equal, it means the menu or item is not currently active, so setting the state to index will activate it (i.e., open the menu).

    //This ternary operator checks if the current activeIndex is equal to the index passed to the function.
  };

  return (
    <div className="body">
      <div className="Card">
        <div className="App">
          <div className="App-header">TODO APP</div>
          <div className="Input-container">
            <input
              className="FormControl"
              placeholder="Add item . . . "
              size="lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button className="btn-custom" onClick={addItem}>
              ADD
            </button>
          </div>
          <div>
            {list.map((item, index) => (
              <div key={item._id} className="ListGroup-item">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(index)}
                  />
                </div>
                <div className={`content ${item.checked ? 'checked' : ''}`}>
                  {item.value}
                </div>
                <div className="dropdown">
                  <button className="btn-more" onClick={() => toggleMenu(index)}>•••</button>
                  {activeIndex === index && (
                    <div className="dropdown-content">
                      <button className="btn-edit" onClick={() => editItem(index)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;