const arrayOfObjects = [
    { name: "John", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
  ];
  
  // Sort the array based on the "name" property
  arrayOfObjects.sort((a, b) => a.name.localeCompare(b.name));
  
  // Output the sorted array
  console.log(arrayOfObjects);