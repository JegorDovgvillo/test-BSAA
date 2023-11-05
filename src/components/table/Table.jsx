import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowDownWideShort,
  faBookOpen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import "./table.scss";
import "./adaptateTable.scss";

const Table = ({ teachers, ...item }) => {
  const [values, setValues] = useState({
    lecturesTeacher: "default",
    laboratoryTeacher: "default",
    practicTeacher: "default",
    seminarTeacher: "default",
    examTeacher: "default",
  });

  const [valuesSecond, setValuesSecond] = useState({
    lecturesSecondTeacher: "default",
    laboratorySecondTeacher: "default",
    practicSecondTeacher: "default",
    seminarSecondTeacher: "default",
    examSecondTeacher: "default",
  });

  const [isActive, setIsActive] = useState(false);
  const [filter, setFilter] = useState(-100);
  const [filterSecond, setFilterSecond] = useState(-100);
  const [podgroupsFirst, setPodgrupsFirst] = useState("0");
  const [podgroupsSecond, setPodgrupsSecond] = useState("0");
  const [note, setNote] = useState("");

  useEffect(() => {
    setPodgrupsFirst(Math.ceil(parseFloat(item.studentsNumber) / 2));
    setPodgrupsSecond(Math.floor(parseFloat(item.studentsNumber) / 2));
  }, []);
  const handlePostData = () => {
    const postData = {
      values,
      valuesSecond,
      note,
    };
    if (isActive) {
      postData.podgroupsFirst = podgroupsFirst;
      postData.podgroupsSecond = podgroupsSecond;
    }
    fetch("https://bgaa.by/test_result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Указываем тип контента как JSON
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Данные успешно отправлены на сервер.");
          // Добавьте код для обработки успешной отправки данных на сервер, если необходимо
        } else {
          console.error("Произошла ошибка при отправке данных на сервер.");
          // Добавьте код для обработки ошибки, если необходимо
        }
      })
      .catch((error) => {
        console.error("Произошла ошибка при выполнении fetch:", error);
        // Добавьте код для обработки ошибки, если необходимо
      });
  };
  const handleChange = (e, field) => {
    console.log();
    if (field.slice(-13).toLowerCase() === "secondteacher") {
      setValuesSecond((prevValues) => ({
        ...prevValues,
        [field]: e.target.value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [field]: e.target.value,
      }));
    }
  };

  function renderOption(data) {
    const option = data.map((item) => {
      return (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      );
    });
    return (
      <>
        <option selected value={"default"}>
          Вакансия
        </option>
        {option}
      </>
    );
  }

  function renderSelect(item, text, isFilter) {
    return (
      <select
        onChange={(e) => {
          handleChange(e, text);
          if (isFilter && text.slice(-13).toLowerCase() == "secondteacher") {
            setFilterSecond(e.target.value);
          } else if (isFilter) {
            setFilter(e.target.value);
          } else {
            setFilter(filter);
            setFilterSecond(filterSecond);
          }
        }}
        name="teachers"
        value={
          item == 0 || item == ""
            ? "null"
            : text.slice(-13).toLowerCase() == "secondteacher"
            ? valuesSecond[text]
            : values[text]
        }
        disabled={item == 0 || item == "" ? true : null}
      >
        {option}
      </select>
    );
  }

  if (!teachers) {
    return <div>hello</div>;
  }

  const option = renderOption(teachers);

  return (
    <div className="table" key={item.uniqueId}>
      <div className="table-title">
        <FontAwesomeIcon
          icon={faBookOpen}
          size="lg"
          style={{ color: "#3c4b64" }}
        />
        <h2>{item.subjectName}</h2>
      </div>
      <div className="table-header">
        <div className="table-header__item">
          <p className="table-header__item-name">Группа</p>
          <p className="table-header__item-value">{item.groupName}</p>
        </div>
        <div className="table-header__item">
          <p className="table-header__item-name">Курс</p>
          <p className="table-header__item-value">{item.course}</p>
        </div>
        <div className="table-header__item">
          <p className="table-header__item-name">Количество курсантов</p>
          <p className="table-header__item-value">{item.studentsNumber}</p>
        </div>
        <div className="table-header__item">
          <p className="table-header__item-name">Семестр</p>
          <p className="table-header__item-value">{item.semestr}</p>
        </div>
      </div>
      <div className="table-body">
        <div className="table-body__item">
          <div className="table-body__item-wrap-title">
            <p className="table-body__item-wrap-subjects">Занятие</p>
            <p className="table-body__item-wrap-hours">Часы</p>
            {isActive ? (
              <>
                <p className="table-body__item-wrap-teachers">Подгруппа 1</p>
                <p className="table-body__item-wrap-teachers">
                  Подгруппа 2{" "}
                  <FontAwesomeIcon
                    icon={faTrash}
                    size="lg"
                    onClick={() => {
                      setValuesSecond({
                        lecturesSecondTeacher: "default",
                        laboratorySecondTeacher: "default",
                        practicSecondTeacher: "default",
                        seminarSecondTeacher: "default",
                        examSecondTeacher: "default",
                      });
                      setIsActive(false);
                    }}
                  />
                </p>
              </>
            ) : (
              <>
                <p className="table-body__item-wrap-teachers">
                  Преподователь
                  <FontAwesomeIcon
                    icon={faPlus}
                    size="lg"
                    onClick={() => setIsActive(true)}
                  />
                </p>
              </>
            )}
          </div>
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">Лекции</p>
            <p className="table-body__item-wrap-hours">{item.lecturesHours}</p>
            {isActive ? (
              <>
                <div className="table-body__item-wrap-teachers filter">
                  {renderSelect(item.lecturesHours, "lecturesTeacher", true)}
                  <FontAwesomeIcon
                    onClick={() => {
                      const updatedValues = { ...values };
                      for (const key in updatedValues) {
                        updatedValues[key] = filter;
                      }
                      setValues(updatedValues);
                    }}
                    size="xl"
                    icon={faArrowDownWideShort}
                    style={{
                      color: "white",
                      backgroundColor: "#3c4b64",
                      borderRadius: "5px",
                    }}
                  />
                </div>
                <div className="table-body__item-wrap-teachers filter">
                  {renderSelect(
                    item.lecturesHours,
                    "lecturesSecondTeacher",
                    true
                  )}
                  <FontAwesomeIcon
                    onClick={() => {
                      const updatedValues = { ...valuesSecond };
                      for (const key in updatedValues) {
                        updatedValues[key] = filterSecond;
                      }
                      setValuesSecond(updatedValues);
                    }}
                    icon={faArrowDownWideShort}
                    size="xl"
                    style={{
                      color: "white",
                      backgroundColor: "#3c4b64",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="table-body__item-wrap-teachers filter">
                {renderSelect(item.lecturesHours, "lecturesTeacher", true)}{" "}
                <FontAwesomeIcon
                  onClick={() => {
                    const updatedValues = { ...values };
                    for (const key in updatedValues) {
                      updatedValues[key] = filter;
                    }
                    setValues(updatedValues);
                  }}
                  size="xl"
                  icon={faArrowDownWideShort}
                  style={{
                    color: "white",
                    backgroundColor: "#3c4b64",
                    borderRadius: "5px",
                  }}
                />
              </div>
            )}
          </div>
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">
              Лабораторные работы
            </p>
            <p className="table-body__item-wrap-hours">
              {item.laboratoryHours}
            </p>
            {isActive ? (
              <>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(
                    item.laboratoryHours,
                    "laboratoryTeacher",
                    false
                  )}
                </div>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(
                    item.laboratoryHours,
                    "laboratorySecondTeacher",
                    false
                  )}
                </div>
              </>
            ) : (
              <div className="table-body__item-wrap-teachers">
                {renderSelect(item.laboratoryHours, "laboratoryTeacher", false)}
              </div>
            )}
          </div>
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">Практические</p>
            <p className="table-body__item-wrap-hours">{item.practicHours}</p>
            {isActive ? (
              <>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(item.practicHours, "practicTeacher", false)}
                </div>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(
                    item.practicHours,
                    "practicSecondTeacher",
                    false
                  )}
                </div>
              </>
            ) : (
              <div className="table-body__item-wrap-teachers">
                {renderSelect(item.practicHours, "practicTeacher", false)}
              </div>
            )}
          </div>
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">Семинарские</p>
            <p className="table-body__item-wrap-hours">{item.seminarHours}</p>
            {isActive ? (
              <>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(item.seminarHours, "seminarTeacher", false)}
                </div>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(
                    item.seminarHours,
                    "seminarSecondTeacher",
                    false
                  )}
                </div>
              </>
            ) : (
              <div className="table-body__item-wrap-teachers">
                {renderSelect(item.seminarHours, "seminarTeacher", false)}
              </div>
            )}
          </div>
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">
              {item.exam == true
                ? "Экзамен"
                : item.exam == false && item.offset == false
                ? null
                : "Зачет"}
            </p>
            <p className="table-body__item-wrap-hours"></p>
            {isActive ? (
              <>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(item.lecturesHours, "examTeacher", false)}
                </div>
                <div className="table-body__item-wrap-teachers">
                  {renderSelect(item.lecturesHours, "examSecondTeacher", false)}
                </div>
              </>
            ) : (
              <div className="table-body__item-wrap-teachers">
                {renderSelect(item.lecturesHours, "examTeacher", false)}
              </div>
            )}
          </div>
          {isActive ? (
            <div className="table-body__item-wrap">
              <p className="table-body__item-wrap-subjects">
                Количесвто человек
              </p>
              <p className="table-body__item-wrap-hours"></p>
              <div className="table-body__item-wrap-teachers">
                <input
                  type="text"
                  value={podgroupsFirst}
                  onChange={(e) => setPodgrupsFirst(e.target.value)}
                />
              </div>
              <div className="table-body__item-wrap-teachers">
                <input
                  type="text"
                  value={podgroupsSecond}
                  onChange={(e) => setPodgrupsSecond(e.target.value)}
                />
              </div>
            </div>
          ) : null}
          <div className="table-body__item-wrap">
            <p className="table-body__item-wrap-subjects">
              Примечание <br />
              (для составления расписания)
            </p>
            <p className="table-body__item-wrap-hours"></p>
            <div className="table-body__item-wrap-teachers">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <button onClick={handlePostData}>Сохранить</button>
      </div>
    </div>
  );
};
export default Table;
