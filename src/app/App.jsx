import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchData } from "../components/table/TableSlice";

import Table from "../components/table/Table";
import Spinner from "../components/spinner/Spinner";

function App() {
  const subjects = useSelector((state) => state.info.value.data);
  const teachers = useSelector((state) => state.info.value.teachers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, []);
  if (!subjects) {
    return <Spinner />;
  }
  return (
    <>
      {subjects.map((item) => {
        return <Table {...item} teachers={teachers} key={item.uniqueId}/>;
      })}
    </>
  );
}

export default App;
