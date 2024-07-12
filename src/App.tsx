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
  Modal,
  Typography,
} from "@mui/material";
import SubCampaignCard from "./components/SubCampaignCard";
import ListAds from "./components/ListAds";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
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
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
                  <ListAds
                    key={selectedItemIndex}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    selectedAds={selectedAds}
                    selectedItemIndex={selectedItemIndex}
                    setSelectedAds={setSelectedAds}
                    values={values}
                  />
                  ;
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
            values && setOpen(true);
          }}
        >
          {({ values, errors }): JSX.Element => (
            <>
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
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Tên chiến dịch {values?.name}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Mô tả {values?.describe}
                  </Typography>
                  {values?.subCampaigns?.map((item) => {
                    return (
                      <>
                        {item?.name}
                        {item?.status}
                      </>
                    );
                  })}
                </Box>
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </ThemeProvider>
  );
}

export default App;
