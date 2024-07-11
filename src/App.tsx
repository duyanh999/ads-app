import "./App.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  createTheme,
  Divider,
  TextField,
  ThemeProvider,
  Switch,
  FormControlLabel,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Campaign {
  information: {
    name: string;
    describe?: string;
  };
  subCampaigns: SubCampaign[];
}

interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

interface Ad {
  name: string;
  quantity: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  subCampaigns: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Required"),
      ads: Yup.array().of(
        Yup.object({
          name: Yup.string().required("Required"),
          quantity: Yup.number().required("Required"),
        })
      ),
    })
  ),
});

function App() {
  const [value, setValue] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState<
    number | null
  >(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(64,80,181)", // Custom primary color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Formik
          initialValues={{
            name: "",
            describe: "",
            subCampaigns: [
              {
                name: "",
                status: false,
                ads: [{ name: "", quantity: 0 }],
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submitted values:", values);
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="mb-3 mt-5 flex justify-end mr-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsSubmitted(true);
                    console.log("Form errors:", errors);
                    console.log("Form touched:", touched);
                  }}
                >
                  Submit
                </Button>
              </div>

              <Divider className="bg-black" />

              <div className="m-5 shadow-lg rounded-md border">
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="Thông tin" {...a11yProps(0)} />
                      <Tab label="Chiến Dịch Con" {...a11yProps(1)} />
                    </Tabs>
                  </Box>

                  <CustomTabPanel value={value} index={0}>
                    <Field
                      as={TextField}
                      label={
                        <div>
                          Tên chiến dịch
                          <span
                            style={{
                              color:
                                isSubmitted && !!errors.name && !!touched.name
                                  ? "red"
                                  : "",
                            }}
                          >
                            *
                          </span>
                        </div>
                      }
                      name="name"
                      fullWidth
                      id="standard-required"
                      variant="standard"
                      error={isSubmitted && !!errors.name && !!touched.name}
                      helperText={
                        isSubmitted && !!errors.name && !!touched.name
                          ? "Dữ liệu không hợp lệ"
                          : ""
                      }
                    />
                    <div className="mt-4">
                      <Field
                        as={TextField}
                        label={<div>Mô tả</div>}
                        name="describe"
                        fullWidth
                        variant="standard"
                      />
                    </div>
                  </CustomTabPanel>

                  <CustomTabPanel value={value} index={1}>
                    <FieldArray name="subCampaigns">
                      {({ push: pushSubCampaign }) => (
                        <div>
                          <div className="flex gap-4 mb-4">
                            <div
                              className="w-[5%] rounded-full h-[50px] bg-gray-500 flex items-center justify-center cursor-pointer"
                              onClick={() =>
                                pushSubCampaign({
                                  name: "",
                                  status: false,
                                  ads: [{ name: "", quantity: 0 }],
                                })
                              }
                            >
                              +
                            </div>
                            <div className="flex overflow-x-auto gap-4 w-[95%] flex-shrink-0">
                              {values.subCampaigns.map(
                                (subCampaign: any, index) => (
                                  <Card
                                    key={index}
                                    onClick={() => setSelectedItemIndex(index)}
                                    style={{
                                      border:
                                        selectedItemIndex === index
                                          ? "2px solid #007bff"
                                          : "1px solid #ccc",
                                    }}
                                    className="bg-white text-xl justify-center pt-4 flex shadow-lg rounded-md mb-1 border w-[220px] h-[120px] flex-shrink-0"
                                  >
                                    <div>
                                      <div>
                                        {subCampaign?.name ||
                                          "Chiến dịch con " + index}
                                      </div>
                                      {subCampaign.ads.map(
                                        (ad: any, adIndex: any) => (
                                          <div key={adIndex}>{ad.quantity}</div>
                                        )
                                      )}
                                      <ErrorMessage
                                        name={`subCampaigns[${index}].name`}
                                        component="div"
                                      />
                                    </div>
                                  </Card>
                                )
                              )}
                            </div>
                          </div>

                          {selectedItemIndex !== null && (
                            <>
                              <div className="flex">
                                <Field
                                  as={TextField}
                                  label="Tên chiến dịch con"
                                  name={`subCampaigns[${selectedItemIndex}].name`}
                                  fullWidth
                                  required
                                  variant="standard"
                                />
                                <FormControlLabel
                                  control={
                                    <Field
                                      as={Switch}
                                      name={`subCampaigns[${selectedItemIndex}].status`}
                                      type="checkbox"
                                      checked={
                                        values.subCampaigns[selectedItemIndex]
                                          .status
                                      }
                                      color="primary"
                                    />
                                  }
                                  label="Status"
                                />
                              </div>
                              <div className="mt-10">
                                <div className="text-2xl flex justify-start">
                                  Danh sách quảng cáo
                                </div>
                                <FieldArray
                                  name={`subCampaigns[${selectedItemIndex}].ads`}
                                >
                                  {({ push: pushAd, remove: removeAd }) => (
                                    <div className="">
                                      <Button
                                        className="w-[5%] rounded-full h-[50px] bg-gray-500 flex items-center justify-start cursor-pointer mb-4"
                                        onClick={() =>
                                          pushAd({
                                            name: "",
                                            quantity: 0,
                                          })
                                        }
                                      >
                                        <div className="w-full  rounded-full h-[50px] bg-gray-500 flex items-center justify-center cursor-pointer mb-4">
                                          +
                                        </div>
                                      </Button>
                                      {values.subCampaigns[
                                        selectedItemIndex
                                      ].ads.map((ad: Ad, adIndex: number) => (
                                        <div
                                          key={adIndex}
                                          className="flex gap-4 mb-4 items-center"
                                        >
                                          <Field
                                            as={TextField}
                                            name={`subCampaigns[${selectedItemIndex}].ads[${adIndex}].name`}
                                            label="Tên"
                                            fullWidth
                                            variant="standard"
                                          />
                                          <Field
                                            as={TextField}
                                            name={`subCampaigns[${selectedItemIndex}].ads[${adIndex}].quantity`}
                                            label="Số lượng"
                                            fullWidth
                                            variant="standard"
                                            type="number"
                                          />
                                          <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => removeAd(adIndex)}
                                          >
                                            Xóa
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </CustomTabPanel>
                </Box>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ThemeProvider>
  );
}

export default App;
