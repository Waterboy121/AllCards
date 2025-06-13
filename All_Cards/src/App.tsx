// import ListGroup from "./components/ListGroup";
import { useState } from "react";
import Button from "./components/Buttons";

import Alert from "./components/Alert";

function App() {
  // let items = [
  //         'New York',
  //         'San Francisco',
  //         'Tokyo',
  //         'London',
  //         'Paris'
  //     ];
  // const handleSelectItem = (item: string) => {
  //   console.log(item);
  // }

  const [alertVisible, setAlertVisibility] = useState(false);
  return (
  <div>
    { alertVisible && <Alert onClose={() =>setAlertVisibility(false)}>
      My alert
    </Alert>}
    <Button color="secondary" onClick={() => setAlertVisibility(true)}>My Button</Button>
    
    {/* <ListGroup items={items} heading="Cities" onSelectItem={handleSelectItem}/> */}
  </div>);
}

export default App;