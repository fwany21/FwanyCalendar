import React, { useState } from "react";

function Data() {
  const [data, setData] = useState({});
  fetch("/data/Req")
    .then((res) => res.json())
    .then(
      (result) => setData(result),
      () => {
        console.log("data read : ", data);
      }
    );

  return (
    <div>
      {data.lastname} {data.firstname}
    </div>
  );
}

export default Data;
