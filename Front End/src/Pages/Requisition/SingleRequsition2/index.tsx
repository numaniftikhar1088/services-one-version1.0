import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import Sections from "./Sections";
import { IRequsitionSection } from "../../../Interface/Requisition";
//////formik import
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from "formik";
import { useEffect, useRef, useState } from "react";
import Masonry from "masonry-layout";
import Splash from "../../../Shared/Common/Pages/Splash";
import { AxiosError, AxiosResponse } from "axios";

const SingleRequisition = () => {
  const [isShown, setIsShown] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [Inputs, setInputs] = useState<any>();
  const masonryRef = useRef<any | null>(null);
  const location = useLocation();

  useEffect(() => {
    getInputs();
  }, [location?.state?.data?.id]);

  const getInputs = async () => {
    setisLoading(true);
    await UserManagementService?.GetSystemFields(location?.state?.data?.id)
      .then((res: AxiosResponse) => {
        let resCopy: any = [...res?.data];
        resCopy[1].fields[4].systemFieldName = "CollectorId";
        setInputs(resCopy);
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() => setisLoading(false));
  };
  useEffect(() => {
    if (isLoading) return;
    masonryRef.current = new Masonry(".grid", {
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer",
      percentPosition: true,
    });
  }, [isLoading]);
  //const { data } = useReactQueryHook(location?.state?.data?.id);

  const generateCards = () => {
    const cards = [];
    for (let x = 0; x < 12; x++) {
      cards.push(
        <div key={x} className="col-12 col-sm-6 pb-4 grid-item">
          <article
            className="card p-5"
            style={{ minHeight: `${8 + Math.random() * 10}ch` }}
          >
            <h1 className="text-center">{x}</h1>
          </article>
        </div>
      );
    }
    return cards;
  };
  useEffect(() => {
    if (masonryRef.current) {
      masonryRef.current.layout();
    }
  }, [isShown]);
  const initialValues = {};
  

  return (
    <>
      {isLoading ? (
        <Splash />
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={(values: any, actions: any) => {
            
            actions.setSubmitting(false);
          }}
        >
          <Form>
            <div className="d-flex flex-column flex-column-fluid">
              <div className="app-toolbar py-3 py-lg-6">
                <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
                  <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                    <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                      <li className="breadcrumb-item text-muted">
                        <a href="" className="text-muted text-hover-primary">
                          Home
                        </a>
                      </li>

                      <li className="breadcrumb-item">
                        <span className="bullet bg-gray-400 w-5px h-2px"></span>
                      </li>

                      <li className="breadcrumb-item text-muted">
                        Requisition
                      </li>

                      <li className="breadcrumb-item">
                        <span className="bullet bg-gray-400 w-5px h-2px"></span>
                      </li>

                      <li className="breadcrumb-item text-muted">
                        Single Requisition
                      </li>
                    </ul>
                  </div>
                  <div className="d-flex align-items-center gap-2 gap-lg-3">
                    <Link
                      to="/view-requisition"
                      className="btn btn-sm fw-bold btn-cancel"
                    >
                      Cancel
                    </Link>
                    <button
                      className="btn btn-sm fw-bold btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_new_target"
                      //onClick={saveRequisition}
                      //disabled={savingRequisition ?? false}
                    >
                      {"save"}
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="kt_app_content"
                className="app-content flex-column-fluid"
              >
                <div className="app-container container-fluid">
                  <div className="grid row">
                    <div
                    // className="col-12 col-sm-6 pb-4 grid-item"
                    // style={{
                    //   width: "100%",
                    //   minHeight: `${3 + Math.random() * 10}ch`,
                    // }}
                    >
                      {Array.isArray(Inputs) &&
                        Inputs?.map(
                          (
                            section: IRequsitionSection,
                            sectionIndex: number
                          ) => (
                            <ul
                              className={`${section.displayType} col-sm-6 grid-item`}
                              key={section.sectionId}
                            >
                              {/* <button onClick={() => setIsShown(!isShown)}>
                                Click
                              </button>
                              {isShown && (
                                <div>
                                  <h2>Some content here</h2>
                                  <h2>Some content here</h2>
                                  <h2>Some content here</h2>
                                  <h2>Some content here</h2>
                                  <h2>Some content here</h2>
                                </div>
                              )} */}
                              <Sections
                                sectionIndex={sectionIndex}
                                section={section}
                                Inputs={Inputs}
                                setInputs={setInputs}
                                setIsShown={setIsShown}
                                isShown={isShown}
                              />
                            </ul>
                          )
                        )}
                    </div>

                    <div className="col-12 col-sm-6 pb-4 grid-item grid-sizer"></div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default SingleRequisition;
