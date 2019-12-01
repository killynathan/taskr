import * as React from "react";

const NewListForm = ({ addList }) => {
  const [newListName, setNewListName] = React.useState("");
  const handleChangeListName = e => setNewListName(e.target.value);
  const handleCancel = () => setNewListName("");
  const handleAddList = () => {
    addList(newListName);
    setNewListName("");
  };
  return (
    <div style={{}}>
      <input type="text" value={newListName} onChange={handleChangeListName} />
      <div>
        <button onClick={handleAddList}>Add List</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default NewListForm;
