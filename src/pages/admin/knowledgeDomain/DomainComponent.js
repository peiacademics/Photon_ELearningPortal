import React, { Fragment, useState, useEffect } from "react";
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";
import ChapterComponent from "./ChapterComponent";
import { Link } from "react-router-dom";
import Axios from "axios";

const DomainComponent = () => {
  const [newTitle, setNewTitle] = useState("");
  const [valid, setValid] = useState(0);
  const [domain, setDomain] = useState([
    // {
    //   id: 0,
    //   collapse: false,
    //   title: "Physics"
    // },
    // {
    //   id: 1,
    //   collapse: false,
    //   title: "Chemistry"
    // },
    // {
    //   id: 2,
    //   collapse: false,
    //   title: "Maths"
    // }
  ]);

  const getSubjects = async () => {
    const res = await Axios.get(
      "https://frozen-temple-25034.herokuapp.com/admin/subjects"
    );
    console.log(res.data);
    setDomain(res.data);
  };
  const addSubject = async title => {
    const res = await Axios.post(
      "https://frozen-temple-25034.herokuapp.com/admin/addSubject",
      {
        subjectTitle: title,
        subjectDescription: ""
      }
    );
    console.log(res.data);
    alert(res.data.message);
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const res = await Axios.delete(
      `https://frozen-temple-25034.herokuapp.com/admin/subject/${id}`
    );
    console.log(res.data);
    alert(res.data);
  };
  useEffect(() => {
    getSubjects();
  }, []);
  useEffect(() => {
    const withCollapse = [...domain];
    withCollapse.map(obj => (obj.collapse = false));
    setDomain(withCollapse);
    console.log(domain);
  }, [domain.length]);
  const toggleCollapse = index => {
    const newArray = [...domain];
    newArray[index] = {
      ...newArray[index],
      collapse: !newArray[index].collapse
    };
    setDomain(newArray);
  };
  const onChange = e => {
    setNewTitle(e.target.value);
    if (newTitle) {
      setValid(1);
    }
  };
  const handleAdd = newTitle => {
    if (newTitle === "") {
      setValid(-1);
    } else {
      addSubject(newTitle);
      // const newArray = [...domain];
      // newArray[domain.length] = {
      //   id: domain.length,
      //   collapse: false,
      //   subject_title: newTitle
      // };
      // setDomain(newArray);
      setNewTitle("");
      setValid(0);
      // console.log(newArray);
    }
  };
  return (
    <Fragment>
      <div id="accordion" className="accordion">
        {domain.map((domain, i) => (
          <Card className="bg-dark text-white" key={i}>
            <CardHeader
              className={
                "card-header bg-dark-darker text-white pointer-cursor " +
                (!domain.collapse ? "collapsed " : "")
              }
              onClick={() => toggleCollapse(i)}
            >
              <i className="fa fa-book fa-2x f-s-8 mr-2 text-teal"></i>{" "}
              <a>{domain.subject_title}</a>
              <div className="btn-group btn-group-justified pull-right">
                <Link className="btn btn-xs btn-primary">Rename</Link>
                <Link
                  onClick={e => handleDelete(e, domain._id)}
                  className="btn btn-xs btn-danger"
                >
                  Delete
                </Link>
              </div>
            </CardHeader>
            <Collapse isOpen={domain.collapse}>
              <CardBody>
                <ChapterComponent
                  subject_id={domain._id}
                  subject_title={domain.subject_title}
                />
                {/* we need to pass a prop here to tell the child components which kd it is */}
              </CardBody>
            </Collapse>
          </Card>
        ))}
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              className={`form-control ${
                valid === 1 ? "is-valid" : valid === -1 ? "is-invalid" : ""
              }`}
              type="text"
              value={newTitle}
              placeholder="Enter New Domain Name."
              onChange={e => onChange(e)}
            />
            <div className="invalid-tooltip">This field can't be empty.</div>
          </div>
          <div className="col-6">
            <button
              onClick={e => handleAdd(newTitle)}
              className="btn btn-primary btn-block m-b-5"
            >
              Add Domain
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DomainComponent;