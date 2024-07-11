import "./App.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
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
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const [itemCampagin, setItemCampagin] = React.useState<SubCampaign>();
  console.log("item", itemCampagin);
  const [inputValue, setInputValue] = React.useState<any>();

  const [subCampaigns, setSubCampaigns] = React.useState<SubCampaign[]>([
    {
      name: "",
      status: false,
      ads: [{ name: "", quantity: 0 }], // Mặc định có một quảng cáo khi tạo mới subCampaign
    },
  ]);
  // const [subCampaignItem, setSubCampaignItem] = React.useState<SubCampaign>();

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
    const newSubCampaign = {
      name: `Chiến dịch con ${subCampaigns?.length + 1}`, // Tên chiến dịch con tự động tăng dần
      status: false,
      ads: [{ name: "", quantity: 0 }], // Mặc định có một quảng cáo khi tạo mới subCampaign
    };
    const updatedSubCampaigns = [...subCampaigns, newSubCampaign];
    setSubCampaigns(updatedSubCampaigns);

    // Cập nhật index của item được chọn thành subCampaign mới thêm vào
    setSelectedItemIndex(updatedSubCampaigns.length - 1);
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
    const handleSubCampaignNameChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = event.target;

      setSubCampaigns((prevSubCampaigns) => {
        const updatedSubCampaigns = [...prevSubCampaigns];
        updatedSubCampaigns[selectedItemIndex].name = value;
        return updatedSubCampaigns;
      });
    };

    const handleAdQuantityChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const updatedSubCampaigns = [...subCampaigns];
      updatedSubCampaigns[selectedItemIndex].ads[index].quantity = parseInt(
        event.target.value
      );
      setSubCampaigns(updatedSubCampaigns);
    };

    return (
      <CustomTabPanel value={value} index={1}>
        <div>
          <div className="flex gap-4">
            <div
              className="w-[5%] rounded-full h-[50px] bg-gray-500 flex items-center justify-center"
              onClick={addSubCampaign}
            >
              Thêm SubCampaign
            </div>
            <div className="flex overflow-x-auto gap-4 w-[95%]  flex-shrink-0">
              {subCampaigns.map((subCampaign, index) => {
                const isSelected = index === selectedItemIndex;

                return (
                  <Card
                    onClick={() => {
                      setSelectedItemIndex(index);
                      setItemCampagin(subCampaign);
                    }}
                    key={index}
                    style={{
                      border: isSelected
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                    }}
                    className={`bg-white text-xl justify-center pt-2 flex shadow-lg rounded-md mb-1 border w-[220px] h-[120px] flex-shrink-0`}
                  >
                    <div>{subCampaign.name}</div>
                    <div>
                      Status: {subCampaign.status ? "Active" : "Inactive"}
                    </div>
                    <div>
                      Ads:
                      {subCampaign.ads.map((ad, adIndex) => (
                        <div key={adIndex}>
                          {ad.name}: {ad.quantity}
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {itemCampagin && (
            <div className="mt-4">
              <input
                type="text"
                value={itemCampagin.name}
                onChange={handleSubCampaignNameChange}
                className="border rounded-md p-2"
                placeholder="SubCampaign Name"
              />
              <Divider className="mt-2 mb-2" />
              <div>
                {itemCampagin.ads.map((ad, index) => (
                  <input
                    key={index}
                    type="number"
                    value={ad.quantity}
                    onChange={(event) => handleAdQuantityChange(index, event)}
                    className="border rounded-md p-2 mt-2"
                    placeholder={`Ad ${index + 1} Quantity`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CustomTabPanel>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Formik
          initialValues={{ name: "", quantity: "", describe: "", name2: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            // Handle form submission here
            console.log("vl", values);
            setInputValue(values);
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
