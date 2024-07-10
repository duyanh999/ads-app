import "./App.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  createTheme,
  Divider,
  TextField,
  ThemeProvider,
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

function App() {
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    quantity: Yup.number().required("Required").positive("Must be positive"),
  });
  const [value, setValue] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [subCampaigns, setSubCampaigns] = React.useState<SubCampaign[]>([]);

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
        main: "rgb(64,80,181)", // Đổi thành màu tím (ví dụ)
      },
    },
  });
  const addSubCampaign = () => {
    const newSubCampaign: SubCampaign = {
      name: "",
      status: false,
      ads: [{ name: "", quantity: 0 }], // Mặc định có một quảng cáo khi tạo mới subCampaign
    };
    setSubCampaigns([...subCampaigns, newSubCampaign]);
  };

  const renderTabInfo = (errors: any, touched: any) => {
    return (
      <CustomTabPanel value={value} index={0}>
        <Field
          as={TextField}
          label={
            <div>
              Tên chiến dịch
              <span
                style={{
                  color:
                    isSubmitted && !!errors.name && !!touched.name ? "red" : "",
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
              ? "Dư liệu không hợp lệ"
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
    );
  };
  const renderTabSubCampaigns = (errors: any, touched: any) => {
    return (
      <CustomTabPanel value={value} index={1}>
        <div>
          <div className="flex gap-4">
            <div
              className="w-[5%] rounded-full h-[50px] bg-gray-500 flex items-center justify-center"
              onClick={addSubCampaign}
            >
              {/* Nút để thêm SubCampaign */}
              Thêm SubCampaign
            </div>
            <div className="flex overflow-x-auto gap-3 w-[95%] flex-shrink-0">
              {/* Hiển thị danh sách các SubCampaign */}
              {subCampaigns.map((subCampaign, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-md mb-1 border w-[220px] h-[120px] flex-shrink-0"
                >
                  <h3>SubCampaign {index + 1}</h3>
                  {/* Các nội dung khác của SubCampaign */}
                </div>
              ))}
            </div>
          </div>

          <Field
            as={TextField}
            name="quantity"
            label="Tab 2 Field"
            fullWidth
            variant="outlined"
            type="number"
            error={isSubmitted && !!errors.quantity && !!touched.quantity}
            helperText={
              isSubmitted && !!errors.quantity && !!touched.quantity
                ? "Dư liệu không hợp lệ"
                : ""
            }
          />
        </div>
      </CustomTabPanel>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Formik
          initialValues={{ name: "", quantity: "", describe: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            // Handle form submission here
            console.log(values);
            const final = {
              campaign: {
                information: {
                  name: values?.name,
                  describe: values?.describe,
                },
              },
            };

            console.log("final", final);
            setSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3 mt-5 flex justify-end mr-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsSubmitted(true);
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
                  {renderTabInfo(errors, touched)}
                  {renderTabSubCampaigns(errors, touched)}
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
