import "./App.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  FormikErrors,
  FieldArrayRenderProps,
} from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import * as Yup from "yup";
import {
  Button,
  createTheme,
  Divider,
  TextField,
  ThemeProvider,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import SubCampaignCard from "./components/SubCampaignCard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Ad {
  name: string;
  quantity: number;
}

interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

interface Campaign {
  name: string;
  describe?: string;
  subCampaigns: SubCampaign[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  subCampaigns: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Required"),
        ads: Yup.array()
          .of(
            Yup.object({
              name: Yup.string().required("Required"),
              quantity: Yup.number()
                .moreThan(0, "Quantity must be greater than 0")
                .required("Required"),
            })
          )
          .min(1, "At least one ad is required"),
      })
    )
    .min(1, "At least one sub campaign is required"),
});

function App() {
  const [value, setValue] = React.useState<number>(0);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState<
    number | null
  >(null);
  const [selectedAds, setSelectedAds] = React.useState<number[]>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);

  const isSubCampaignInvalid = (errors: any, index: number) => {
    return isSubmitted && errors.subCampaigns?.[index];
  };

  const handleAdCheckboxChange = (adIndex: number): void => {
    setSelectedAds((prevSelectedAds) =>
      prevSelectedAds.includes(adIndex)
        ? prevSelectedAds.filter((index) => index !== adIndex)
        : [...prevSelectedAds, adIndex]
    );
  };

  const handleDeleteSelectedAds = (removeAd: (index: number) => void) => {
    if (selectedItemIndex !== null) {
      for (let i = 0; i < selectedAds.length; i++) {
        removeAd(selectedAds[i]);
      }
    }
  };

  const handleDeleteAd = (
    adIndex: number,
    removeAd: (index: number) => void
  ) => {
    removeAd(adIndex);
    setSelectedAds((prevSelectedAds) =>
      prevSelectedAds.filter((index) => index !== adIndex)
    );
  };

  const handleSelectAllChange = (ads: Ad[]): void => {
    if (selectAll) {
      setSelectedAds([]);
    } else {
      setSelectedAds(ads.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  function CustomTabPanel(props: TabPanelProps): JSX.Element {
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

  function a11yProps(index: number): { id: string; "aria-controls": string } {
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

  const renderListCardCampagins = (
    pushSubCampaign: FieldArrayRenderProps["push"],
    values: Campaign,
    errors: FormikErrors<Campaign>
  ) => {
    return (
      <div className="flex gap-4 mb-4">
        <IconButton
          style={{
            backgroundColor: "rgb(237,237,237)",
          }}
          className=" rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
          onClick={(): void => {
            const newSubCampaignIndex = values.subCampaigns.length;
            pushSubCampaign({
              name: "",
              status: false,
              ads: [{ name: "", quantity: 0 }],
            });
            setSelectedItemIndex(newSubCampaignIndex);
          }}
        >
          <AddIcon className="text-[#F50057]" />
        </IconButton>
        <div className="flex overflow-x-auto gap-4 w-[95%] flex-shrink-0">
          {values.subCampaigns.map(
            (subCampaign: SubCampaign, index: number) => (
              <SubCampaignCard
                key={index}
                subCampaign={subCampaign}
                index={index}
                isSelected={selectedItemIndex === index}
                onSelect={() => setSelectedItemIndex(index)}
                isInvalid={isSubCampaignInvalid(errors, index)}
              />
            )
          )}
        </div>
      </div>
    );
  };

  const renderTabInfo = (errors: FormikErrors<Campaign>) => {
    return (
      <CustomTabPanel value={value} index={0}>
        <Field
          as={TextField}
          label={
            <div>
              Tên chiến dịch
              <span
                style={{
                  color: isSubmitted && !!errors.name ? "red" : "",
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
          error={!!(isSubmitted && errors.name)}
          helperText={isSubmitted && errors.name ? "Dữ liệu không hợp lệ" : ""}
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

  const renderDetailCampaign = (
    values: Campaign,
    errors: FormikErrors<Campaign>
  ) => {
    return (
      selectedItemIndex !== null && (
        <>
          <div className="flex justify-between px-3">
            <Field
              as={TextField}
              label={
                <div>
                  Tên chiến dịch con
                  <span
                    style={{
                      color:
                        isSubmitted &&
                        (errors as any)?.subCampaigns?.[selectedItemIndex]?.name
                          ? "red"
                          : "",
                    }}
                  >
                    *
                  </span>
                </div>
              }
              name={`subCampaigns[${selectedItemIndex}].name`}
              className="w-[60%]"
              error={
                !!(
                  isSubmitted &&
                  (errors as any)?.subCampaigns?.[selectedItemIndex]?.name
                )
              }
              helperText={
                isSubmitted &&
                (errors as any)?.subCampaigns?.[selectedItemIndex]?.name &&
                "Dữ liệu không hợp lệ"
              }
              variant="standard"
            />

            <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  name={`subCampaigns[${selectedItemIndex}].status`}
                  type="checkbox"
                  checked={values.subCampaigns[selectedItemIndex].status}
                  color="primary"
                />
              }
              label="Đang hoạt động"
            />
          </div>
        </>
      )
    );
  };

  const renderListAds = (values: Campaign, errors: FormikErrors<Campaign>) => {
    return (
      selectedItemIndex !== null && (
        <div className="mt-10">
          <div className="text-xl mb-7 px-3 flex justify-start">
            DANH SÁCH QUẢNG CÁO
          </div>

          <FieldArray name={`subCampaigns[${selectedItemIndex}].ads`}>
            {({ push: pushAd, remove: removeAd }): JSX.Element => (
              <div>
                <div className="flex gap-4 w-full justify-between items-center mb-4">
                  <div>
                    <Checkbox
                      checked={selectedAds.length > 0}
                      indeterminate={
                        selectedAds.length > 0 &&
                        selectedAds.length <
                          values.subCampaigns[selectedItemIndex].ads.length
                      }
                      onChange={(): void =>
                        handleSelectAllChange(
                          values.subCampaigns[selectedItemIndex].ads
                        )
                      }
                    />
                  </div>
                  {selectedAds.length > 0 ? (
                    selectAll ? (
                      <IconButton
                        className="absolute right-[43.5%]"
                        style={{ color: "#757575" }}
                        onClick={(): void => {
                          selectedAds.forEach((adIndex) =>
                            handleDeleteSelectedAds(removeAd)
                          );
                          setSelectedAds([]);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        className="absolute right-[43.5%]"
                        style={{ color: "#757575" }}
                        onClick={(): void => {
                          for (let i = 0; i < selectedAds.length; i++) {
                            removeAd(selectedAds[i]);
                          }
                          setSelectedAds([]);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  ) : (
                    <>
                      <div className="absolute left-[6.5%]">
                        <div>Tên quảng cáo*</div>
                      </div>
                      <div className="absolute left-[40%]">
                        <div>Số lượng*</div>
                      </div>
                    </>
                  )}

                  <Button
                    className="w-[6.5%] rounded-full bg-gray-500 flex items-center cursor-pointer"
                    variant="outlined"
                    onClick={(): void =>
                      pushAd({
                        name: "",
                        quantity: 0,
                      })
                    }
                  >
                    <div className="flex justify-between gap-2 items-center">
                      <AddIcon fontSize="small" />
                      <div>Thêm</div>
                    </div>
                  </Button>
                </div>
                <Divider />
                {values.subCampaigns[selectedItemIndex].ads.map(
                  (ad: Ad, adIndex: number) => (
                    <div
                      key={adIndex}
                      className={` ${
                        selectedAds.includes(adIndex)
                          ? "bg-pink-100"
                          : "hover:bg-neutral-100"
                      }`}
                    >
                      <div className={`flex gap-4 mb-4 `}>
                        <Checkbox
                          checked={selectedAds.includes(adIndex)}
                          onChange={(): void => handleAdCheckboxChange(adIndex)}
                          color="primary"
                        />
                        <Field
                          as={TextField}
                          name={`subCampaigns[${selectedItemIndex}].ads[${adIndex}].name`}
                          label={`Tên quảng cáo`}
                          className={"w-[60%]"}
                          variant="standard"
                          error={
                            isSubmitted &&
                            !!(
                              (errors.subCampaigns as any)?.[selectedItemIndex]
                                ?.ads as any
                            )?.[adIndex]?.name
                          }
                        />
                        <Field
                          as={TextField}
                          name={`subCampaigns[${selectedItemIndex}].ads[${adIndex}].quantity`}
                          label="Số lượng"
                          className={"w-40%]"}
                          fullWidth
                          variant="standard"
                          error={
                            isSubmitted &&
                            !!(
                              (errors.subCampaigns as any)?.[selectedItemIndex!]
                                ?.ads as any
                            )?.[adIndex]?.quantity
                          }
                          type="number"
                        />

                        <IconButton
                          style={{ color: "#757575" }}
                          onClick={(): void =>
                            handleDeleteAd(adIndex, removeAd)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      <Divider className="" />
                    </div>
                  )
                )}
              </div>
            )}
          </FieldArray>
        </div>
      )
    );
  };

  const renderTabCampaign = (
    values: Campaign,
    errors: FormikErrors<Campaign>
  ) => {
    return (
      <CustomTabPanel value={value} index={1}>
        <FieldArray name="subCampaigns">
          {({ push: pushSubCampaign }): JSX.Element => (
            <div>
              {renderListCardCampagins(pushSubCampaign, values, errors)}
              {selectedItemIndex !== null && (
                <>
                  {renderDetailCampaign(values, errors)}
                  {renderListAds(values, errors)}
                </>
              )}
            </div>
          )}
        </FieldArray>
      </CustomTabPanel>
    );
  };

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
          onSubmit={(values: Campaign, { setSubmitting }): void => {
            setSubmitting(false);
            alert(JSON.stringify(values));
          }}
        >
          {({ values, errors, touched }): JSX.Element => (
            <Form>
              <div className="mb-3 mt-5 flex justify-end mr-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(): void => {
                    setIsSubmitted(true);
                    Object.keys(errors).length &&
                      alert("Vui lòng điền đúng và đầy đủ thông tin");
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

                  {renderTabInfo(errors)}
                  {renderTabCampaign(values, errors)}
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
